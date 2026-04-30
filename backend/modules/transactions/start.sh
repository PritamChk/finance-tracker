#!/bin/bash
# Start Transactions Module Server
cd "$(dirname "$0")"
export MODULE_CONFIG="$(pwd)/application.properties"
PORT=8003
echo "Starting Transactions Module on port $PORT..."
echo "Using config: $MODULE_CONFIG"
uv run uvicorn transactions_app.main:app --host 127.0.0.1 --port $PORT --reload
