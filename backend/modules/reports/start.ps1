# PowerShell start script for Reports module

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    uv venv venv
}

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing/updating dependencies..."
uv pip install -e ./reports_app
uv pip install -e ../../shared

# Start the server in background
Write-Host "Starting Reports module on port 8006..."
$job = Start-Job -ScriptBlock {
    Set-Location $using:ScriptDir
    .\venv\Scripts\Activate.ps1
    uvicorn reports_app.main:app --host 127.0.0.1 --port 8006 --reload
}

$job | Out-File -FilePath "reports_job.txt"
Write-Host "Reports module started. Job ID: $($job.Id)"
Write-Host "Monitor with: Get-Job -Id $($job.Id)"
Write-Host "Stop with: Stop-Job -Id $($job.Id); Remove-Job -Id $($job.Id)"
