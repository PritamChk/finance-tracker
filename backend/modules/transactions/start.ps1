# Start Transactions Module Server (Windows)
Set-Location $PSScriptRoot
$env:PYTHONPATH = (Resolve-Path "../../").Path + ";" + $env:PYTHONPATH
$PORT = 8003
Write-Host "Starting Transactions Module on port $PORT..."
uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT --reload
