# AI Chatbot with Next.js and Django

## Overview

This project is an AI-driven chatbot application built using **Next.js** for the frontend and **Django** for the backend. The chatbot integrates with the **DeepSeek API** (or any other generative AI model) to provide conversational responses. The application includes a user-friendly chat interface, conversation history storage, and optional features like dark mode and responsive design.

## Features

### Frontend (Next.js)
- **Chat Interface**: Allows users to send messages to the AI and view responses in real-time.
- **Conversation History**: Displays past conversations stored in the database.
- **Dark Mode**: Enhances user experience with a dark theme option.
- **Responsive Design**: Ensures the application is accessible on various devices.

### Backend (Django)
- **REST API**: Provides endpoints to send user prompts to the AI and return responses.
- **Database Integration**: Stores conversation history in a PostgreSQL database using Django models.
- **User Management**: Supports user profiles and personalized AI settings (optional).

### Optional Features (Bonus)
- **Multi-language Support**: Detects user language and responds accordingly.
- **File Upload**: Allows users to upload documents for AI analysis.
- **Enhanced Security**: Implements refresh token logic for authentication.
- **Pagination/Infinite Scroll**: Improves user experience by loading chat history in chunks.

## Setup Instructions

### Prerequisites
- **Node.js** and **npm** installed for the frontend.
- **Python** and **pip** installed for the backend.
- **PostgreSQL** database (managed by Aiven in this case).
- **DeepSeek API Key** (or any other AI API key).

### Database Configuration
- The project uses an **Aiven-managed PostgreSQL database**.
- Create a `.env` file in the root of the `chatbot` folder and copy the environment variables from `.env.example` to `.env`.
- Add your **DeepSeek API key** to the `.env` file.

### Backend Setup
```bash
cd ./server
```
1. **Activate the virtual environment**:
   ```bash
   source venv/bin/activate  # On macOS/Linux
   venv\Scripts\activate     # On Windows
   ```
2. **Install dependencies**
	```bash
	pip install -r requirements.txt
	```
3. **Run migrations**
	```bash
	python chatbot/manage.py makemigrations
	python chatbot/manage.py migrate
	```
3. **Start the Django development server**
	```bash
	python chatbot/manage.py runserver
	```
### Frontend Setup
```bash
cd ./client
```
1. **Install dependencies**
	```bash
	npm install
	```
2. **Start the Next.js development server**
	```bash
	npm run dev
	```
### Running the Project
* **Backend**: The Django server will run on `http://localhost:8000`.
* **Frontend**: The Next.js application will run on `http://localhost:3000`.


## Areas of Improvement
* **Frontend Optimization**: Reduce unnecessary re-rendering to improve performance.

* **UX/UI Enhancements**: Improve the user interface and overall user experience.

* **Input Validation**: Add more robust input validation on the server side.

* **Security**: Enhance the authentication system with refresh token logic.

* **Pagination/Infinite Scroll**: Implement pagination or infinite scroll for chat history to improve user experience.