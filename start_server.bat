@echo off
echo Starting local web server...
echo.
echo Server will start at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Python 3 체크
python --version 2>nul | findstr /C:"Python 3" >nul
if %errorlevel% == 0 (
    echo Using Python 3...
    python -m http.server 8000
    goto end
)

REM Python 2 체크
python --version 2>nul
if %errorlevel% == 0 (
    echo Using Python 2...
    python -m SimpleHTTPServer 8000
    goto end
)

REM Node.js http-server 체크
where http-server >nul 2>nul
if %errorlevel% == 0 (
    echo Using http-server...
    http-server -p 8000
    goto end
)

echo.
echo ERROR: No suitable web server found!
echo Please install one of the following:
echo   - Python (https://www.python.org/)
echo   - Node.js http-server (npm install -g http-server)
echo.
pause

:end