# Stop Auth Module Server

Write-Host "Stopping Auth Module on port 8001..."
Get-Process | Where-Object { $_.ProcessName -like "*uvicorn*" -or $_.CommandLine -like "*app.main:app*" } | Stop-Process -Force
Write-Host "Server stopped."
