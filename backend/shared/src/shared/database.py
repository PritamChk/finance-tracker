"""Shared database configuration for all modules."""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from shared.config_loader import load_config
from pathlib import Path
import sys
import os

# Add backend root to path (go up 4 levels: shared/src/shared -> backend)
backend_root = Path(__file__).parent.parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

# Load config - use MODULE_CONFIG env var, or look for application.properties in parent dirs
config_path = os.getenv("MODULE_CONFIG")
if not config_path:
    # Search for application.properties starting from cwd, going up to backend_root
    cwd = Path.cwd()
    config_path = str(cwd / "application.properties")
    if not os.path.exists(config_path):
        # Try going up until we find it or reach backend_root
        for parent in [cwd] + list(cwd.parents):
            test_path = parent / "application.properties"
            if test_path.exists():
                config_path = str(test_path)
                break
            if parent == backend_root:
                break

config = load_config(config_path)

# Get database URL from config, default to single finance_tracker.db
db_url = config.get("database.url", "sqlite:///database/finance_tracker.db")

# If relative path, make it absolute relative to backend_root
if db_url.startswith("sqlite:///"):
    db_file = db_url.replace("sqlite:///", "")
    if not Path(db_file).is_absolute():
        db_url = f"sqlite:///{(backend_root / db_file).absolute()}"

engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)
