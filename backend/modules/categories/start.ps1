# Categories Module Start Script
$ErrorActionPreference = "Stop"
$Port = 8002

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "Starting Categories Module API on port $Port..." -ForegroundColor Green
uv run uvicorn categories_app.main:app --host 127.0.0.1 --port $Port --reload