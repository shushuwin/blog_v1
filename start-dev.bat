@echo off
setlocal
set ROOT=%~dp0
cd /d "%ROOT%"

if not exist ".venv\Scripts\python.exe" (
  python -m venv .venv
)

set VENV_PY=.venv\Scripts\python.exe
"%VENV_PY%" -m pip install --upgrade pip
"%VENV_PY%" -m pip install -r backend\requirements.txt

start "backend" cmd /k "%VENV_PY% backend\main.py"
start "frontend" cmd /k "cd /d \"%ROOT%frontend\" && npm install && npm run dev -- --host"

endlocal