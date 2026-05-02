import sys
from pathlib import Path
from contextlib import asynccontextmanager
from configparser import ConfigParser

backend_root = Path(__file__).parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import categories_app.database as database_module
from shared.models.user import User  # noqa: F401 - registers users table
from categories_app.models.category import Category
from categories_app.api.categories import router as categories_router
from categories_app.middleware.logging import log_requests


def load_config():
    """Load config from properties file."""
    config_path = Path(__file__).parent.parent / "application.properties"
    parser = ConfigParser()
    with open(config_path, "r") as f:
        content = f.read()
    if not content.startswith("["):
        content = "[default]\n" + content
    parser.read_string(content)
    return parser


config = load_config()


def get_config_value(key: str, default: str = "") -> str:
    """Get config value."""
    return config.get("default", key, fallback=default)


def get_config_list(key: str) -> list:
    """Get config value as list."""
    value = get_config_value(key, "")
    return [item.strip() for item in value.split(",") if item.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    database_module.init_db()
    yield


app = FastAPI(
    title="Categories Module API",
    description="Category management endpoints",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_config_list("cors.allowed_origins"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories_router)

app.middleware("http")(log_requests)


@app.get("/")
async def root():
    return {"message": "Categories Module API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}