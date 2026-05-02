from loguru import logger
from pathlib import Path
import sys

log_dir = Path(__file__).parent.parent.parent / "log"
log_dir.mkdir(exist_ok=True)

log_format = "{level}|{time:YYYY-MM-DD HH:mm:ss.SSS}|{message}"

logger.remove()

logger.add(
    sys.stdout,
    format=log_format,
    level="INFO",
    colorize=True
)

logger.add(
    log_dir / "categories_sysdate.{time:YYYYMMDD}.log",
    format=log_format,
    level="INFO",
    rotation="00:00",
    retention="25 days",
    compression="zip",
    enqueue=True
)

logger.add(
    log_dir / "categories_errors.{time:YYYYMMDD}.log",
    format=log_format,
    level="ERROR",
    rotation="00:00",
    retention="25 days",
    compression="zip",
    enqueue=True
)