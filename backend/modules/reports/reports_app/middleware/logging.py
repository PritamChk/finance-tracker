from fastapi import Request
from reports_app.core.logger import logger
import time

async def log_requests(request: Request, call_next):
    start_time = time.time()
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"REQUEST|method={request.method}|path={request.url.path}|ip={client_ip}")
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"RESPONSE|status={response.status_code}|duration={duration:.3f}s|path={request.url.path}")
    return response
