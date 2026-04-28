# Auth Module - Phase 4 v1.0

## Overview
Create API endpoints for authentication and write tests.

## Goals
- Create register endpoint
- Create login endpoint
- Create refresh token endpoint
- Create get current user endpoint
- Write comprehensive tests

## Prerequisites
- Phase 3 completed

## Implementation Steps

### 1. Create Auth Endpoints
File: `app/api/auth.py`
```python
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from shared.database import get_db
from shared.security import create_access_token
from shared.config_loader import load_config
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.crud.user import create_user, authenticate_user, get_user_by_email
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

config = load_config()
ACCESS_TOKEN_EXPIRE_MINUTES = config.get_int("security.access_token_expire_minutes", 30)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user.

    Args:
        user: User creation data.
        db: Database session.

    Returns:
        Created user.

    Raises:
        HTTPException: If email already registered.
    """
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    return create_user(db=db, user=user)


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and get JWT token.

    Args:
        user_credentials: User login credentials.
        db: Database session.

    Returns:
        JWT access token.

    Raises:
        HTTPException: If credentials are invalid.
    """
    user = authenticate_user(db, email=user_credentials.email, password=user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token)


@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh JWT token.

    Args:
        current_user: Current authenticated user.

    Returns:
        New JWT access token.
    """
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.email}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user information.

    Args:
        current_user: Current authenticated user.

    Returns:
        Current user information.
    """
    return current_user
```

### 2. Register Router in main.py
```python
from app.api.auth import router as auth_router

app.include_router(auth_router)
```

### 3. Write Tests
File: `tests/test_auth.py`
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

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
    assert response.status_code == 403
```

### 4. Run Tests
```bash
uv run pytest tests/ -v
```

## Deliverables
- [ ] Register endpoint created
- [ ] Login endpoint created
- [ ] Refresh token endpoint created
- [ ] Get current user endpoint created
- [ ] All tests passing
- [ ] Swagger UI shows all endpoints

## Verification

### Manual Testing
1. Start server: `./run.sh`
2. Visit http://localhost:8001/docs
3. Test register endpoint
4. Test login endpoint
5. Test refresh token endpoint
6. Test get current user endpoint (with Bearer token)

### API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info

## Module Complete
Auth module is now complete and ready for integration with other modules.
