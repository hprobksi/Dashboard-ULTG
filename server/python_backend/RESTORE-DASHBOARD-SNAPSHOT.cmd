@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\dashboard-ui\RESTORE-SNAPSHOT-UI.ps1"
pause
