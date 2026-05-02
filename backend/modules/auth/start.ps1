# Start Auth Module Server (Windows)
Set-Location $PSScriptRoot
Write-Host "Starting Auth Module on port 8001..."
uv run uvicorn auth_app.main:app --host 127.0.0.1 --port 8001 --reload
