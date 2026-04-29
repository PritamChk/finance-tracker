# Categories Module Start Script
$ErrorActionPreference = "Stop"
$Port = 8002

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "Starting Categories Module API on port $Port..." -ForegroundColor Green
uv run uvicorn app.main:app --host 0.0.0.0 --port $Port --reload