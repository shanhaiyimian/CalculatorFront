@echo off
title RAG Server

:: Set DeepSeek API Key (get yours at https://platform.deepseek.com/api_keys)
set DEEPSEEK_API_KEY=your_api_key_here

set PORT=8000

echo.
echo ============================================
echo   RAG Q&amp;A System - Backend Server
echo ============================================
echo   API Key: [configured]
echo   Port: %PORT%
echo   Docs: http://127.0.0.1:%PORT%/docs
echo.
echo   Press Ctrl+C to stop
echo ============================================
echo.

cd /d "%~dp0rag-server"

:: Kill any existing process on the port
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
)

python -m uvicorn main:app --host 127.0.0.1 --port %PORT% --reload

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [FAIL] Port %PORT% blocked or in use.
    echo Run: netstat -ano ^| findstr ":%PORT%"
    echo Or try running as Administrator.
)
pause
