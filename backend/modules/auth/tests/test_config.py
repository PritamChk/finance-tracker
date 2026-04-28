"""Configuration tests."""

import sys
from pathlib import Path

# Add backend to path for shared imports
backend_root = Path(__file__).parent.parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from shared.config_loader import load_config


def test_config_load():
    """Test configuration loads successfully."""
    config = load_config()
    assert config is not None


def test_config_get():
    """Test getting configuration values."""
    config = load_config()
    port = config.get_int("server.port")
    assert port == 8001


def test_config_get_list():
    """Test getting list configuration values."""
    config = load_config()
    origins = config.get_list("cors.allowed_origins")
    assert len(origins) > 0
    assert "http://localhost:3000" in origins
