@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\BUAT-PAKET-UPDATE-VOLTKRAFT.ps1"
pause
