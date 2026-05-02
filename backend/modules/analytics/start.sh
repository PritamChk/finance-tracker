#!/bin/bash
# Start Analytics Module Server
cd "$(dirname "$0")"
export MODULE_CONFIG="$PWD/application.properties"
uv run uvicorn app.main:app --host 127.0.0.1 --port 8005 --reload
