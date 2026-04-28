#!/bin/bash
# Stop Auth Module Server

echo "Stopping Auth Module on port 8001..."
pkill -f "uvicorn app.main:app"
echo "Server stopped."
