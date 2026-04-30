#!/bin/bash
# Start Auth Module Server
cd "$(dirname "$0")"
export MODULE_CONFIG="$(pwd)/application.properties"
echo "Starting Auth Module on port 8001..."
echo "Using config: $MODULE_CONFIG"
uv run uvicorn auth_app.main:app --host 127.0.0.1 --port 8001 --reload
