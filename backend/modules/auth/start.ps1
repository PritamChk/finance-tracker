# Start Auth Module Server (Windows)

Write-Host "Starting Auth Module on port 8001..."
uv run uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
