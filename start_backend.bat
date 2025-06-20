@echo off
echo ========================================================
echo    Starting Mindful Verse Nexus Backend Server
echo ========================================================

:: Check if Python is available
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH. Please install Python 3.8 or higher.
    pause
    exit /b 1
) else (
    echo [OK] Python is installed.
)

:: Check if the server is already running on port 5001
echo Checking if port 5001 is already in use...
netstat -ano | findstr :5001 >nul
if %errorlevel% equ 0 (
    echo [INFO] The backend server is already running on port 5001.
    echo If you're having connection issues, try stopping the server and starting it again.
    echo To stop the server, find the process ID using: netstat -ano | findstr :5001
    echo Then terminate it using: taskkill /F /PID [process_id]
    pause
    exit /b 0
) else (
    echo [OK] Port 5001 is available.
)

:: Check if .env file exists
echo Checking environment configuration...
if not exist ".env" (
    echo [WARNING] .env file not found. Creating a default one.
    echo GEMINI_API_KEY=YOUR_GEMINI_API_KEY> .env
    echo [ACTION REQUIRED] Please edit the .env file and add your Gemini API key.
)

:: Navigate to the backend directory and start the server
echo Changing to backend directory...
cd backend

:: Check if required Python packages are installed
echo Checking required Python packages...
pip show flask flask-sqlalchemy flask-jwt-extended >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Some required packages may be missing. Installing them now...
    pip install flask flask-sqlalchemy flask-jwt-extended flask-cors python-dotenv google-generativeai
)

echo ========================================================
echo Starting Flask server on port 5001...
echo The server will remain running as long as this window is open.
echo To stop the server, close this window or press Ctrl+C.
echo ========================================================
echo.

python app.py

echo.
echo If the server stopped unexpectedly, check the error messages above.
pause
