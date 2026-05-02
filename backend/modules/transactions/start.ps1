# Start Transactions Module Server (Windows)
Set-Location $PSScriptRoot
$Port = 8003
Write-Host "Starting Transactions Module on port $Port..."
uv run uvicorn transactions_app.main:app --host 127.0.0.1 --port $Port --reload
