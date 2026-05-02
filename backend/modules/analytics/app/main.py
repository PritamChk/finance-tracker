from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from shared.config_loader import load_config
from shared.models.user import User  # noqa: F401 - registers users table
from app.models.category import Category  # noqa: F401 - registers categories table
from app.models.transaction import Transaction  # noqa: F401 - registers transactions table
from app.core.logger import logger
from app.middleware.logging import log_requests
from app.api.analytics import router as analytics_router

# Load configuration
config = load_config()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB if needed
    from app.database import init_db
    init_db()
    logger.info("Analytics Module starting up...")
    yield
    logger.info("Analytics Module shutting down...")

app = FastAPI(
    title="Analytics Module API",
    description="Financial analytics endpoints",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get_list("cors.allowed_origins"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging Middleware
app.middleware("http")(log_requests)

# Include Routers
app.include_router(analytics_router)

@app.get("/")
async def root():
    return {"message": "Analytics Module API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
