@echo off
cd /d "%~dp0"
echo Starting Candle Quest Reborn...
python -m http.server 8123
pause
