@echo off
echo Checking if local server is running...

REM 로컬 서버가 실행 중인지 확인
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Local server is not running!
    echo Please run start_server.bat first.
    echo.
    pause
    exit /b 1
)

set "CURRENT_DIR=%cd%"

REM capture.bat에 로컬 서버 URL 전달
echo Capturing from http://localhost:8000/index.html
call "D:\jong\test\figma\figma_to_html\capture.bat" "http://localhost:8000/index.html" "%CURRENT_DIR%\images\html_current.png"

if %ERRORLEVEL% EQU 0 (
    echo Capture completed: %CURRENT_DIR%\images\html_current.png
) else (
    echo Capture failed!
)
pause