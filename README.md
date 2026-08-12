# HelpMate

Multi-lingual first-aid and emergency guidance application built with React Native (Expo) frontend and FastAPI backend with MongoDB.

## Prerequisites

- Node.js (v18+)
- Python (3.10+)
- MongoDB (running on `localhost:27017`)

## Project Structure

```
HelpMate/
├── backend/       # FastAPI server and MongoDB connection
└── frontend/      # Expo React Native web and mobile app
```

## Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install fastapi uvicorn motor python-dotenv pydantic
   ```

4. Create environment configuration (`backend/.env`):
   ```env
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="helpmate_db"
   PORT=8000
   ```

5. Start the server:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`.

## Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   - Web:
     ```bash
     npx expo start --web
     ```
   - Mobile:
     ```bash
     npx expo start
     ```

   The web app will run at `http://localhost:8081`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/` | Health check endpoint |
| POST | `/api/status` | Create status check record |
| GET | `/api/status` | List status check records |

## Supported Languages

English, German, French, Spanish, Italian.
