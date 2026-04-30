#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export MODULE_CONFIG="$SCRIPT_DIR/application.properties"
cd "$SCRIPT_DIR" && uv run uvicorn analytics.app.main:app --host 127.0.0.1 --port 8005 --reload
