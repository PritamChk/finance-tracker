from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from shared.config_loader import load_config
from shared.database import init_db, Base
from shared.models.user import User  # noqa: F401 - registers users table
from reports_app.models.category import Category  # noqa: F401 - registers categories table
from reports_app.models.transaction import Transaction  # noqa: F401 - registers transactions table
from reports_app.core.logger import logger
from reports_app.middleware.logging import log_requests
from reports_app.api import reports as reports_router

# Load configuration
config = load_config()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("REPORTS_MODULE_STARTING")
    init_db()
    logger.info("REPORTS_MODULE_STARTED")
    yield
    logger.info("REPORTS_MODULE_SHUTDOWN")

# Create FastAPI app
app = FastAPI(
    title="Finance Tracker - Reports API",
    description="Generate transaction reports (CSV, PDF) with category-wise filtering",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
cors_origins = config.get("cors.allowed_origins", "http://localhost:5173,http://localhost:5174")
origins = [origin.strip() for origin in cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
app.middleware("http")(log_requests)

# Health endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Register routers
app.include_router(reports_router.router)

if __name__ == "__main__":
    import uvicorn
    port = int(config.get("server", "port", fallback="8006"))
    uvicorn.run(app, host="127.0.0.1", port=port)
