# Stop Transactions Module Server
Write-Host "Stopping Transactions Module on port 8003..."
Get-Process | Where-Object { $_.ProcessName -like "*uvicorn*" -or $_.CommandLine -like "*app.main:app*" } | Stop-Process -Force
Write-Host "Server stopped."
