@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\stop-voltkraf-localhost.ps1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\voltkraf-localhost-installer\start-voltkraf-localhost.ps1" -EnableLan
pause
