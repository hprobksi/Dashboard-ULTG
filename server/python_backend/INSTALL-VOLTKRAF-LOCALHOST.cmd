@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\install-voltkraf-localhost.ps1" -StartAfterInstall -EnableAutostart
pause
