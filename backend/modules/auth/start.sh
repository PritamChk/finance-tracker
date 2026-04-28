#!/bin/bash
# Start Auth Module Server

echo "Starting Auth Module on port 8001..."
uv run uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
