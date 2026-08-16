# HelpMate (Pratham Sahay)

Multilingual first-aid and emergency guidance application built with React Native (Expo) frontend and FastAPI backend with MongoDB.

## Prerequisites

- Node.js (v18+)
- Python (3.10+)
- MongoDB (running on `localhost:27017`)
- Android SDK & JDK 17+ (required for local Android builds)

## Project Structure

```
HelpMate/
|-- backend/       # FastAPI server and MongoDB connection
`-- frontend/      # Expo React Native mobile and web application
```

## Backend Setup

1. Navigate to the backend directory:
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
   pip install -r requirements.txt
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

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   - Development Server / Mobile Metro:
     ```bash
     npm run start
     ```
   - Android Emulator / Connected Device:
     ```bash
     npm run android
     ```
   - iOS Simulator (macOS only):
     ```bash
     npm run ios
     ```
   - Web:
     ```bash
     npm run web
     ```

## Building & Installing the Android APK

All build commands should be executed from within the `frontend/` directory.

### 1. Local APK Build (via Gradle)

Build directly on your local machine using Android SDK:

- **Universal APK (Local)**:
  ```bash
  npm run build:local
  ```
  *Alternative direct command:*
  ```bash
  cd android && ./gradlew assembleRelease
  ```
  Output APK location: `frontend/android/app/build/outputs/apk/release/app-release.apk`

- **Optimized ARM64 APK (Smaller file size)**:
  ```bash
  npm run build:local:arm64
  ```
  *Alternative direct command:*
  ```bash
  cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
  ```

### 2. Cloud APK Build (via EAS Build)

Build standalone APKs in the cloud using Expo Application Services:

- **Standard Preview APK**:
  ```bash
  npm run build:apk
  ```
  *Direct command:*
  ```bash
  npx eas-cli build --platform android --profile preview
  ```

- **ARM64 Optimized Preview APK**:
  ```bash
  npm run build:apk:arm64
  ```
  *Direct command:*
  ```bash
  npx eas-cli build --platform android --profile preview-arm64
  ```

- **Production App Bundle (AAB for Google Play)**:
  ```bash
  npm run build:aab
  ```

### 3. Installing the APK on a Connected Android Device

Connect your Android device via USB with USB Debugging enabled, then run:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

Or for updating an existing installation:
```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/` | Health check endpoint |
| POST | `/api/status` | Create status check record |
| GET | `/api/status` | List status check records |

## Supported Languages

English, Hindi, Marathi, Maithili, Bhojpuri, and Bengali.

