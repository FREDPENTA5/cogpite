@echo off
REM Start the DealScout Docker Compose stack from the infra folder.
cd /d %~dp0
powershell -ExecutionPolicy Bypass -File startup.ps1
