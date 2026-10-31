@echo off
REM Start de website op een lokale server EN een publieke tunnel,
REM zodat je de site kunt delen via een link.
REM
REM Dubbelklik dit bestand. Er verschijnt een URL die je kunt kopiëren.
REM Sluit dit venster om alles te stoppen.

setlocal
set PORT=8123
set DIR=%~dp0
set CF=%TEMP%\cloudflared.exe

echo.
echo   Lil's haarsalon - website delen
echo   --------------------------------
echo.

REM --- 1. Lokale server starten ---
where npx >nul 2>nul
if errorlevel 1 (
  echo   Geen Node.js gevonden. Je kunt de site ook gewoon openen
  echo   door dubbel te klikken op index.html.
  echo.
  start "" "%DIR%index.html"
  pause
  exit /b
)

echo   1. Lokale server starten op poort %PORT% ...
start "Lil's haarsalon - lokale server" cmd /k "npx --yes http-server -p %PORT% -c-1 "%DIR%""
timeout /t 4 /nobreak >nul

REM --- 2. Cloudflared ophalen als het er nog niet is ---
if not exist "%CF%" (
  echo   2. Cloudflared downloaden, eenmalig ...
  powershell -NoProfile -Command ^
    "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%CF%'"
)

REM --- 3. Tunnel starten ---
echo   3. Tunnel starten ...
echo.
echo   De URL verschijnt hieronder. Kopieer die om de site te delen.
echo   Stoppen: sluit dit venster.
echo.

"%CF%" tunnel --url http://localhost:%PORT% --no-autoupdate

endlocal
