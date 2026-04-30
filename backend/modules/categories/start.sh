#!/bin/bash
# Categories Module Start Script
cd "$(dirname "$0")"
export MODULE_CONFIG="$(pwd)/application.properties"
PORT=8002
echo "Starting Categories Module API on port $PORT..."
echo "Using config: $MODULE_CONFIG"
uv run uvicorn categories_app.main:app --host 127.0.0.1 --port $PORT --reload