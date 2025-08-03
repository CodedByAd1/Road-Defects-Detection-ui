@echo off
echo Starting Road Defect Detection Development Environment...
echo.

echo Installing frontend dependencies...
npm install

echo.
echo Starting backend server (Python Flask)...
echo Please ensure you have Python and the required packages installed.
echo Run: pip install -r requirements.txt
echo.
start "Backend Server" cmd /k "python backend-example.py"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting frontend development server...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:8000
echo.
npm run dev

pause 