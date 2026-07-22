@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\update-voltkraf-app.ps1" -RestartAfterUpdate
pause
