# Backend Server Setup

## Starting the Backend Server

The Mindful Verse Nexus application requires the backend server to be running for features like audio transcription, chat, and session analysis to work properly.

### Using the Start Script (Recommended)

1. Double-click the `start_backend.bat` file in the root directory
2. This will start the Flask server on port 5001
3. Keep the terminal window open while using the application
4. The script will automatically check for dependencies and install them if needed

### Manual Setup

If you prefer to start the server manually:

1. Open a terminal/command prompt
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install required dependencies:
   ```
   pip install flask flask-sqlalchemy flask-jwt-extended flask-cors python-dotenv google-generativeai
   ```
4. Run the Flask application:
   ```
   python app.py
   ```

## Setting Up Gemini API Key (Required for Audio Processing)

The audio processing feature uses Google's Gemini 1.5 Pro API for transcription and analysis. You need to set up an API key:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or edit the `.env` file in the root directory of the project
3. Add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
4. Restart the backend server for the changes to take effect

## Troubleshooting Audio Processing

### Connection to Backend Server Failed

If you see "Connection to the backend server failed" when using the audio recording feature:

1. Check if the backend server is running:
   - Look for a terminal window showing Flask logs
   - The terminal should show "Running on http://127.0.0.1:5001"

2. If the server is not running:
   - Start it using the `start_backend.bat` file
   - Check for any error messages in the terminal

3. If the server starts but stops immediately:
   - Check for error messages related to missing dependencies
   - Run `pip install flask flask-sqlalchemy flask-jwt-extended flask-cors python-dotenv google-generativeai`

4. If you see "Gemini models failed to initialize":
   - Your API key might be missing or invalid
   - Check the `.env` file and ensure the API key is correct

### Invalid Response Format Error

If you see "Failed to transcribe audio: Invalid response format":

1. Check if your Gemini API key is valid and has access to Gemini 1.5 Pro
2. Ensure you have sufficient quota/credits in your Google AI account
3. Try recording a shorter audio sample (30-60 seconds)

### Port Already in Use

If you see an error saying port 5001 is already in use:

1. Find the process using port 5001:
   - Windows: `netstat -ano | findstr :5001`
   - The last number in the output is the Process ID (PID)

2. Stop the process:
   - Windows: `taskkill /F /PID <process_id>`
   - Replace `<process_id>` with the actual PID

3. Try starting the server again

## Environment Variables

The backend requires the following environment variables:

- `GEMINI_API_KEY`: Your Google Gemini API key for chat and audio transcription

You can set these in a `.env` file in the root directory or as system environment variables.

## Testing the Backend Server

To verify the backend server is working correctly:

1. Start the backend server using `start_backend.bat`
2. Open a web browser and navigate to: `http://localhost:5001`
3. You should see a welcome message if the server is running correctly

For audio processing specifically:

1. Ensure the Gemini API key is set up correctly
2. Check the terminal logs when you attempt to record audio
3. Look for messages indicating successful initialization of Gemini models
