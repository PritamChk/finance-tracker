"""Loguru logger configuration for Auth module."""

from loguru import logger
from pathlib import Path
import sys

# Create log directory
log_dir = Path(__file__).parent.parent.parent / "log"
log_dir.mkdir(exist_ok=True)

# Custom format: LEVEL|TIMESTAMP|MESSAGE
log_format = "{level}|{time:YYYY-MM-DD HH:mm:ss.SSS}|{message}"

# Remove default handler
logger.remove()

# Console handler (dev)
logger.add(
    sys.stdout,
    format=log_format,
    level="INFO",
    colorize=True
)

# File handler with rotation
logger.add(
    log_dir / "auth_sysdate.{time:YYYYMMDD}.log",
    format=log_format,
    level="INFO",
    rotation="00:00",
    retention="25 days",
    compression="zip",
    enqueue=True
)

# Separate error file
logger.add(
    log_dir / "auth_errors.{time:YYYYMMDD}.log",
    format=log_format,
    level="ERROR",
    rotation="00:00",
    retention="25 days",
    compression="zip",
    enqueue=True
)
