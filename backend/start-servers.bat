@echo off
echo ========================================
echo Luxora Environmental - Starting Servers
echo ========================================
echo.

echo Starting Node.js Backend (Port 4000)...
start "Node.js Backend" cmd /k "cd /d %~dp0 && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Python Image Server (Port 5000)...
start "Python Image Server" cmd /k "cd /d %~dp0 && python server.py"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo Node.js Backend: http://localhost:4000
echo Python Server: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul

