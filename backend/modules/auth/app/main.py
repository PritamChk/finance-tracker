"""FastAPI application entry point for Auth module."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import sys
from pathlib import Path

# Add backend to path for shared imports
backend_root = Path(__file__).parent.parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from shared.config_loader import load_config
from shared.database import init_db
from app.models.user import User
from app.api.auth import router as auth_router

# Load config from local application.properties
config_path = Path(__file__).parent.parent / "application.properties"
config = load_config(str(config_path))

app = FastAPI(
    title="Auth Module API",
    description="Authentication and authorization endpoints",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get_list("cors.allowed_origins"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup."""
    init_db()


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Auth Module API", "status": "running"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}
