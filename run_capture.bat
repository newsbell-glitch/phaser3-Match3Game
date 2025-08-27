@echo off
echo Starting capture process...
echo.
echo Please make sure the browser window with the game is active.
echo The capture will start in 3 seconds...
timeout /t 3 /nobreak >nul

set "CURRENT_DIR=%cd%"

REM Create PowerShell script file temporarily
echo Add-Type @" > capture_temp.ps1
echo using System; >> capture_temp.ps1
echo using System.Drawing; >> capture_temp.ps1
echo using System.Windows.Forms; >> capture_temp.ps1
echo public class ScreenCapture { >> capture_temp.ps1
echo     public static void CaptureScreen(string filename) { >> capture_temp.ps1
echo         Rectangle bounds = Screen.PrimaryScreen.Bounds; >> capture_temp.ps1
echo         using (Bitmap bitmap = new Bitmap(bounds.Width, bounds.Height)) { >> capture_temp.ps1
echo             using (Graphics g = Graphics.FromImage(bitmap)) { >> capture_temp.ps1
echo                 g.CopyFromScreen(Point.Empty, Point.Empty, bounds.Size); >> capture_temp.ps1
echo             } >> capture_temp.ps1
echo             bitmap.Save(filename); >> capture_temp.ps1
echo         } >> capture_temp.ps1
echo     } >> capture_temp.ps1
echo } >> capture_temp.ps1
echo "@ -ReferencedAssemblies System.Drawing, System.Windows.Forms >> capture_temp.ps1
echo [ScreenCapture]::CaptureScreen('%CURRENT_DIR%\images\html_current.png') >> capture_temp.ps1

powershell -ExecutionPolicy Bypass -File capture_temp.ps1
del capture_temp.ps1

if exist "%CURRENT_DIR%\images\html_current.png" (
    echo Capture completed: %CURRENT_DIR%\images\html_current.png
) else (
    echo Capture failed! Use manual capture: Alt+PrintScreen
)
pause