@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\dashboard-ui\RESTORE-FIXED-UI.ps1"
pause
