# fygus-assignement
## How to use
database
- already configured by Aiven managed Postgres Database
- create `.env` file at the root of the chatbot folder copy envirement variables from `.env.example` to `.env` (please note that for the sake of this assignement I have pushed my secret keys to the repository, it's not a good practice to do so)
- add DeepSeek API key to the `.env` file
backend
- run env activete
- intial migration
- migration
- runserver (python chatbot/manage.py runserver)
frontend
- run `npm run dev`


## Areas of improvement
- Optimize frontend for more efficenty, by resucing re-rendering
- Working more on the UX/UI
- Add more input validation in the server
- More security for the authentication system
- Enhance user experience by making use of refresh token logic for authentication on the frontend
- Pagination/Infinite scroll to chat and chat context to enhance user experience
