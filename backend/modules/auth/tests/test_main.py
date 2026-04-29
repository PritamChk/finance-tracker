"""Main application tests for auth module."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_main_app_initialization():
    """Test that the main app initializes and responds to root."""
    response = client.get("/")
    assert response.status_code == 200
