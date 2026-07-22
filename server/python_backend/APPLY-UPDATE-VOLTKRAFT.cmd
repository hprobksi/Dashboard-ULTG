@echo off
setlocal
cd /d "%~dp0"

set "DEFAULT_PROJECT=%USERPROFILE%\VoltKraft"

echo.
echo === APPLY UPDATE VOLTKRAFT ===
echo Folder paket : %CD%
echo.
echo Masukkan folder project VoltKraft di server.
echo Tekan Enter untuk memakai default: %DEFAULT_PROJECT%
echo.
set /p PROJECT_DIR=ProjectDir: 
if "%PROJECT_DIR%"=="" set "PROJECT_DIR=%DEFAULT_PROJECT%"

if not exist "%PROJECT_DIR%\api.py" (
    echo.
    echo ERROR: Folder project tidak valid atau api.py tidak ditemukan:
    echo %PROJECT_DIR%
    echo.
    pause
    exit /b 1
)

echo.
choice /C YN /N /M "Server dipakai mode LAN? [Y/N]: "
if errorlevel 2 (
    set "LAN_ARG="
) else (
    set "LAN_ARG=-EnableLan"
)

echo.
echo Menjalankan apply update...
echo ProjectDir : %PROJECT_DIR%
if "%LAN_ARG%"=="-EnableLan" echo Mode       : LAN
if not "%LAN_ARG%"=="-EnableLan" echo Mode       : Localhost
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\APPLY-UPDATE-VOLTKRAFT.ps1" -ProjectDir "%PROJECT_DIR%" %LAN_ARG%
set "RESULT=%ERRORLEVEL%"

echo.
if "%RESULT%"=="0" (
    echo Update selesai.
) else (
    echo Update gagal. Lihat pesan di atas. Jika perlu, script apply sudah mencoba rollback otomatis.
)
echo.
pause
exit /b %RESULT%
