@echo off
setlocal EnableExtensions
title Update VoltKraft Server Kantor
cd /d "%~dp0"

echo.
echo ============================================================
echo  UPDATE AMAN VOLTKRAFT SERVER KANTOR
echo ============================================================
echo.
echo Script ini akan:
echo  - backup data operasional di %%USERPROFILE%%\VoltKraft\backups
echo  - update file aplikasi VoltKraft
echo  - tidak menimpa database/config/token/credential lokal
echo  - menjalankan ulang server mode LAN
echo.

if not exist ".\deploy\voltkraf-localhost-installer\update-voltkraf-app.ps1" (
    echo ERROR: Script update tidak ditemukan.
    echo Pastikan ZIP update sudah di-extract lengkap sebelum menjalankan file ini.
    pause
    exit /b 1
)

if not exist "%USERPROFILE%\VoltKraft" (
    echo ERROR: Folder install belum ditemukan:
    echo   %USERPROFILE%\VoltKraft
    echo.
    echo Jalankan KLIK-INSTALL-VOLTKRAFT-SERVER-KANTOR.cmd untuk install pertama.
    pause
    exit /b 1
)

echo Menjalankan update aman VoltKraft...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\update-voltkraf-app.ps1" -RestartAfterUpdate -EnableLan
if errorlevel 1 (
    echo.
    echo Script update memberi kode error. Mengecek apakah server sebenarnya sudah hidup...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { $health = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/health' -TimeoutSec 5; if ($health.status -eq 'ok') { exit 0 } else { exit 1 } } catch { exit 1 }"
    if not errorlevel 1 (
        echo Server VoltKraft sudah hidup. Proses dilanjutkan.
        goto after_update_check
    )
    echo.
    echo UPDATE GAGAL.
    echo Data lama tetap aman karena backup dibuat sebelum copy aplikasi.
    echo Cek pesan error di atas. Jika perlu, screenshot pesan error tersebut.
    pause
    exit /b 1
)

:after_update_check
echo.
echo ============================================================
echo  UPDATE SELESAI
echo ============================================================
echo.
echo Dashboard:
echo   http://localhost:8000
echo.
echo Backup ada di:
echo   %USERPROFILE%\VoltKraft\backups
echo.
pause
