@echo off
setlocal EnableExtensions
title Install VoltKraft Server Kantor
cd /d "%~dp0"

echo.
echo ============================================================
echo  INSTALL VOLTKRAFT SERVER KANTOR
echo ============================================================
echo.
echo Script ini akan:
echo  - install/update VoltKraft ke folder %%USERPROFILE%%\VoltKraft
echo  - menjaga database/config existing jika sudah pernah terinstall
echo  - mengaktifkan mode LAN di port 8000
echo  - membuka Windows Firewall TCP 8000 melalui prompt Administrator
echo  - mengaktifkan autostart saat Windows login
echo  - menjalankan server setelah install selesai
echo.

if not exist ".\deploy\voltkraf-localhost-installer\install-voltkraf-localhost.ps1" (
    echo ERROR: Script installer tidak ditemukan.
    echo Pastikan ZIP sudah di-extract lengkap sebelum menjalankan file ini.
    pause
    exit /b 1
)

echo Menjalankan installer VoltKraft...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\install-voltkraf-localhost.ps1" -StartAfterInstall -EnableAutostart -EnableLan
if errorlevel 1 (
    echo.
    echo Installer memberi kode error. Mengecek apakah server sebenarnya sudah hidup...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { $health = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/health' -TimeoutSec 5; if ($health.status -eq 'ok') { exit 0 } else { exit 1 } } catch { exit 1 }"
    if not errorlevel 1 (
        echo Server VoltKraft sudah hidup. Proses dilanjutkan.
        goto after_install_check
    )
    echo.
    echo INSTALL GAGAL.
    echo Cek pesan error di atas. Jika perlu, screenshot pesan error tersebut.
    pause
    exit /b 1
)

:after_install_check
echo.
echo Membuka Windows Firewall TCP 8000 untuk akses dari PC lain...
if exist ".\deploy\voltkraf-localhost-installer\open-voltkraf-firewall.ps1" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\open-voltkraf-firewall.ps1" -Port 8000
) else (
    echo WARNING: Script firewall tidak ditemukan. Jika akses LAN gagal, buka TCP 8000 manual.
)

echo.
echo ============================================================
echo  INSTALL SELESAI
echo ============================================================
echo.
echo Buka dashboard lokal:
echo   http://localhost:8000
echo.
echo Untuk PC lain di jaringan kantor, buka:
echo   http://IP-LAPTOP-KANTOR:8000
echo.
echo Penting: matikan server VoltKraft di laptop lama agar polling dan
echo notifikasi WhatsApp tidak dobel.
echo.
pause
