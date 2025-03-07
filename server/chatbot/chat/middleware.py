from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.conf import settings
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from urllib.parse import parse_qs
from authentication.models import User

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Get the token from query string
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [''])[0]
        
        # If token isn't in query params, try to get it from headers
        if not token:
            headers = dict(scope.get('headers', []))
            auth_header = headers.get(b'authorization', b'').decode()
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
        
        # Default user to None (unauthenticated)
        scope['user'] = None
        
        # Try to authenticate with the token
        if token:
            try:
                # Decode the token
                payload = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                
                # Get the user based on the payload
                user_id = payload.get('user_id')
                if user_id:
                    scope['user'] = await get_user(user_id)
            except (InvalidToken, TokenError):
                pass
        
        return await super().__call__(scope, receive, send)