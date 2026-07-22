@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\install-voltkraf-localhost.ps1" -StartAfterInstall -EnableAutostart -EnableLan
if exist ".\deploy\voltkraf-localhost-installer\open-voltkraf-firewall.ps1" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\open-voltkraf-firewall.ps1" -Port 8000
)
pause
