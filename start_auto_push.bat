@echo off
echo Starting auto-push script...
Powershell.exe -executionpolicy remotesigned -File "%~dp0auto_push.ps1"
pause
