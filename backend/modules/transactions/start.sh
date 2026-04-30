#!/bin/bash
# Start Transactions Module Server
cd "$(dirname "$0")"
export PYTHONPATH="$(cd ../.. && pwd):$PYTHONPATH"
PORT=8003
echo "Starting Transactions Module on port $PORT..."
uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT --reload
