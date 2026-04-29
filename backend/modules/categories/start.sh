#!/bin/bash
# Categories Module Start Script
cd "$(dirname "$0")"
PORT=8002
echo "Starting Categories Module API on port $PORT..."
uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT --reload