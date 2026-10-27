@echo off
cd /d "%~dp0"
echo OTK - Otewe Kantin
where py >nul 2>nul
if %errorlevel%==0 (
  start "OTK Localhost" cmd /k "py -m http.server 5173"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (start "OTK Localhost" cmd /k "python -m http.server 5173") else (
    echo Python belum terpasang. Install Python atau jalankan: npx serve . -l 5173
    pause
    exit /b 1
  )
)
timeout /t 2 >nul
start http://localhost:5173
