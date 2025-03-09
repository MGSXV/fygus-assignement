// chat-service.js
export class ChatService {
	token: string;
	socket: WebSocket | null;
	callbacks: {
		onMessage: (data: any) => void;
		onOpen: (event: Event) => void;
		onClose: (event: CloseEvent) => void;
		onChatCreated: (data: any) => void;
		onError: (error: any) => void;
	};

	constructor(token: string) {
		this.token = token;
		this.socket = null;
		this.callbacks = {
			onMessage: () => {},
			onOpen: () => {},
			onClose: () => {},
			onChatCreated: () => {},
			onError: () => {}
		};
	}
	
	// Connect to existing chat
	connectToChat(chatId: any) {
		if (this.socket) {
			this.socket.close();
		}
		
		this.socket = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/?token=${this.token}`);
		this._setupEventHandlers();
		return this;
	}
	
	// Create a new chat
	createNewChat() {
		if (this.socket) {
		this.socket.close();
		}
		
		this.socket = new WebSocket(`ws://localhost:8000/ws/chat/new/?token=${this.token}`);
		this._setupEventHandlers();
		return this;
	}
	
	// Send a message
	sendMessage(message: any) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			console.log('---------->Sending message:', message);
		this.socket.send(JSON.stringify({
			type: 'message',
			message: message
		}));
		} else {
		this.callbacks.onError('Socket not connected');
		}
	}
	
	// Create a chat with a specific title
	createChatWithTitle(title: any) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify({
				type: 'create_chat',
				title: title
			}));
		} else {
			this.callbacks.onError('Socket not connected');
		}
	}
	
	// Set event callbacks
	onMessage(callback: any) {
		this.callbacks.onMessage = callback;
		return this;
	}
	
	onOpen(callback: any) {
		this.callbacks.onOpen = callback;
		return this;
	}
	
	onClose(callback: any) {
		this.callbacks.onClose = callback;
		return this;
	}
	
	onChatCreated(callback: any) {
		this.callbacks.onChatCreated = callback;
		return this;
	}
	
	onError(callback: any) {
		this.callbacks.onError = callback;
		return this;
	}
	
	// Close connection
	disconnect() {
		if (this.socket) {
		this.socket.close();
		this.socket = null;
		}
	}
	
	// Private method to setup event handlers
	_setupEventHandlers() {
		if (this.socket) {
			this.socket.onopen = (event) => {
				this.callbacks.onOpen(event);
			};

			this.socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				
				if (data.type === 'chat_created') {
					this.callbacks.onChatCreated(data);
				} else if (data.type === 'message') {
					this.callbacks.onMessage(data);
				} else {
					this.callbacks.onMessage(data);
				}
			};
			
			this.socket.onclose = (event) => {
				this.callbacks.onClose(event);
			};
			
			this.socket.onerror = (error) => {
				this.callbacks.onError(error);
			};
		}
	}
}