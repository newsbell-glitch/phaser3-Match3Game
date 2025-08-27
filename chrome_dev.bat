@echo off
echo Starting Chrome with disabled security for development...
echo WARNING: This is for development only!
echo.

set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME_PATH% (
    set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

if exist %CHROME_PATH% (
    start "" %CHROME_PATH% --disable-web-security --user-data-dir="%TEMP%\chrome_dev" --allow-file-access-from-files "file:///%cd:\=/%/index.html"
    echo Chrome started. The game should be loading...
) else (
    echo Chrome not found! Please update CHROME_PATH in this script.
    pause
)