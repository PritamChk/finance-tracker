import sys
from pathlib import Path
backend_root = Path(__file__).parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from shared.config_loader import load_config
from shared.database import init_db
from shared.models.user import User  # noqa: F401 - registers users table
from transactions_app.models.transaction import Transaction  # noqa: F401 - registers transactions table
from categories_app.models.category import Category  # noqa: F401 - registers categories table
from transactions_app.middleware.logging import log_requests
from contextlib import asynccontextmanager
from transactions_app.api.transactions import router as transactions_router

# Load configuration
config = load_config()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Context manager for managing the lifespan of the FastAPI application.
    Initializes the database on startup and closes resources on shutdown.
    """
    init_db()
    yield

app = FastAPI(
    title="Transactions Module API",
    description="Transaction management endpoints",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get_list("cors.allowed_origins"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add logging middleware
app.middleware("http")(log_requests)

# Include routers
app.include_router(transactions_router)

@app.get("/")
async def root():
    return {"message": "Transactions Module API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
