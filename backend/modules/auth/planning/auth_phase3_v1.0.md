# Auth Module - Phase 3 v1.0

## Overview
Implement security features: password hashing, JWT token generation/validation, and authentication dependencies.

## Goals
- Implement password hashing using bcrypt
- Create JWT token generation and validation
- Create authentication dependency for protected routes
- Create user CRUD operations

## Prerequisites
- Phase 2 completed
- Shared security utilities available

## Implementation Steps

### 1. Create User CRUD Operations
File: `app/crud/user.py`
```python
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from shared.security import get_password_hash, verify_password


def get_user_by_email(db: Session, email: str) -> User | None:
    """Get user by email.

    Args:
        db: Database session.
        email: User email.

    Returns:
        User if found, None otherwise.
    """
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Get user by ID.

    Args:
        db: Database session.
        user_id: User ID.

    Returns:
        User if found, None otherwise.
    """
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user: UserCreate) -> User:
    """Create new user.

    Args:
        db: Database session.
        user: User creation data.

    Returns:
        Created user.
    """
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Authenticate user with email and password.

    Args:
        db: Database session.
        email: User email.
        password: Plain text password.

    Returns:
        User if authentication successful, None otherwise.
    """
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user
```

### 2. Create Authentication Dependency
File: `app/core/deps.py`
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from shared.database import get_db
from shared.security import decode_access_token
from app.crud.user import get_user_by_id

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Get current authenticated user.

    Args:
        credentials: HTTP authorization credentials.
        db: Database session.

    Returns:
        Current authenticated user.

    Raises:
        HTTPException: If token is invalid or user not found.
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_by_email(db, email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
```

### 3. Create __init__.py for CRUD
File: `app/crud/__init__.py`
```python
from app.crud.user import (
    get_user_by_email,
    get_user_by_id,
    create_user,
    authenticate_user,
)
```

## Deliverables
- [ ] User CRUD operations created
- [ ] Authentication dependency created
- [ ] Password hashing verified
- [ ] JWT token generation tested

## Next Phase
Phase 4: API Endpoints & Testing
