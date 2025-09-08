@echo off
title Start Project
echo ====================================
echo         === Starting Project ===
echo ====================================

REM Save root path
set "ROOT_DIR=%cd%"

REM === FRONTEND DEPENDENCIES ===
echo Checking frontend dependencies...
IF NOT EXIST "%ROOT_DIR%\frontend\node_modules" (
    echo Installing frontend dependencies...
    start "Frontend Install" cmd /k "cd /d %ROOT_DIR%\frontend && npm install && echo === Frontend install complete ==="
) ELSE (
    echo Frontend dependencies already installed.
)

REM === BACKEND DEPENDENCIES ===
echo Checking backend dependencies...
IF NOT EXIST "%ROOT_DIR%\backend\node_modules" (
    echo Installing backend dependencies...
    start "Backend Install" cmd /k "cd /d %ROOT_DIR%\backend && npm install && echo === Backend install complete ==="
) ELSE (
    echo Backend dependencies already installed.
)

REM === OPTIONAL: WAIT FOR INSTALLS ===
REM timeout /t 20 >nul

REM === START FRONTEND SERVER ===
echo Launching frontend...
start "Frontend" cmd /k "cd /d %ROOT_DIR%\frontend && npm run dev"

REM === START BACKEND SERVER ===
echo Launching backend...
start "Backend" cmd /k "cd /d %ROOT_DIR%\backend && npm run dev"

REM === OPEN LOCALHOST IN DEFAULT BROWSER ===
echo Opening http://localhost:5000 in browser...
start "" "http://localhost:5000"

echo ====================================
echo         === Project Started ===
echo ====================================
pause
