# Start Analytics Module Server (Windows)
Set-Location $PSScriptRoot
$env:MODULE_CONFIG = "$PSScriptRoot\application.properties"
uv run uvicorn app.main:app --host 127.0.0.1 --port 8005 --reload
