"""Shared test fixtures for auth module."""

import sys
from pathlib import Path

# Add backend and auth module to path for shared imports
backend_root = Path(__file__).parent.parent.parent.parent
auth_root = Path(__file__).parent.parent
for root in [backend_root, auth_root]:
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# CRITICAL: Import Base and models BEFORE test engine setup
from shared.database import Base, get_db
from app.models.user import User
from app.api.auth import router as auth_router
from app.middleware.logging import log_requests

# In-memory test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine
)


@pytest.fixture(scope="function")
def db_session():
    """Create fresh database for each test."""
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client():
    """Create test client with database override."""
    # Create tables first
    Base.metadata.create_all(bind=test_engine)

    # Create test app without lifespan (no init_db call)
    test_app = FastAPI(title="Test Auth API")
    test_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    test_app.middleware("http")(log_requests)
    test_app.include_router(auth_router)

    def override_get_db():
        """Override get_db to use test database session."""
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    test_app.dependency_overrides[get_db] = override_get_db
    with TestClient(test_app) as test_client:
        yield test_client
    test_app.dependency_overrides.clear()

    # Drop tables after test
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def test_user_data():
    """Standard test user data."""
    return {
        "email": "test@example.com",
        "password": "SecurePass123!"
    }


@pytest.fixture
def test_user(db_session, test_user_data):
    """Create a test user in database."""
    from app.crud.user import create_user
    from app.schemas.user import UserCreate

    user_create = UserCreate(**test_user_data)
    return create_user(db=db_session, user=user_create)


@pytest.fixture
def auth_token(client, test_user_data):
    """Get auth token for test user."""
    # Register user
    client.post("/api/auth/register", json=test_user_data)

    # Login and get token
    response = client.post("/api/auth/login", json=test_user_data)
    return response.json()["access_token"]
