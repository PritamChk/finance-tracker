"""Auth module tests."""

import sys
from pathlib import Path

# Add backend to path for shared imports
backend_root = Path(__file__).parent.parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Import models after creating test engine to ensure proper binding
from app.models.user import User
from shared.database import Base, get_db


def override_get_db():
    """Override get_db for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    """Setup database for each test."""
    # Create tables using test engine
    Base.metadata.create_all(bind=test_engine)
    yield
    # Drop tables after each test
    Base.metadata.drop_all(bind=test_engine)


# Override the database dependency
from app.main import app
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_register():
    """Test user registration."""
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "testpass123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_register_duplicate_email():
    """Test registration with duplicate email."""
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "testpass123"}
    )
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "differentpass"}
    )
    assert response.status_code == 400


def test_login():
    """Test user login."""
    # First register
    client.post(
        "/api/auth/register",
        json={"email": "login@example.com", "password": "testpass123"}
    )

    # Then login
    response = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "testpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials():
    """Test login with invalid credentials."""
    response = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpass"}
    )
    assert response.status_code == 401


def test_get_me():
    """Test getting current user."""
    # Register and login
    client.post(
        "/api/auth/register",
        json={"email": "me@example.com", "password": "testpass123"}
    )
    login_response = client.post(
        "/api/auth/login",
        json={"email": "me@example.com", "password": "testpass123"}
    )
    token = login_response.json()["access_token"]

    # Get current user
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me@example.com"


def test_get_me_unauthorized():
    """Test getting current user without token."""
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_refresh_token():
    """Test token refresh."""
    # Register and login
    client.post(
        "/api/auth/register",
        json={"email": "refresh@example.com", "password": "testpass123"}
    )
    login_response = client.post(
        "/api/auth/login",
        json={"email": "refresh@example.com", "password": "testpass123"}
    )
    token = login_response.json()["access_token"]

    # Refresh token
    response = client.post(
        "/api/auth/refresh",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
