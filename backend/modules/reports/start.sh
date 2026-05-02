#!/usr/bin/env bash
# Start the reports module

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Starting Reports module on port 8006..."
uv run uvicorn reports_app.main:app --host 127.0.0.1 --port 8006 --reload 

#echo $! > reports.pid
#echo "Reports module started with PID: $(cat reports.pid)"
#echo "Logs: $SCRIPT_DIR/reports.log"
