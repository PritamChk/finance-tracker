#!/bin/bash
# Stop Transactions Module Server
echo "Stopping Transactions Module on port 8003..."
pkill -f "uvicorn app.main:app"
echo "Server stopped."
