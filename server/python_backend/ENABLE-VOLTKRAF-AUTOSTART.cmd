@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\enable-voltkraf-autostart.ps1"
pause
