# Auth Module - Phase 2 v1.0

## Overview
Define database models and Pydantic schemas for user authentication.

## Goals
- Create User database model
- Create Pydantic schemas for user operations
- Set up database table creation

## Prerequisites
- Phase 1 completed

## Implementation Steps

### 1. Create User Model
File: `app/models/user.py`
```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from shared.database import Base


class User(Base):
    """User model for authentication."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
```

### 2. Create User Schemas
File: `app/schemas/user.py`
```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr = Field(..., description="User email address")
    full_name: Optional[str] = Field(None, description="User full name")


class UserCreate(UserBase):
    """Schema for user creation."""

    password: str = Field(..., min_length=8, description="User password")


class UserLogin(BaseModel):
    """Schema for user login."""

    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class UserResponse(UserBase):
    """Schema for user response."""

    id: int = Field(..., description="User ID")
    created_at: str = Field(..., description="User creation timestamp")

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field("bearer", description="Token type")
```

### 3. Create Models __init__.py
File: `app/models/__init__.py`
```python
from app.models.user import User

__all__ = ["User"]
```

### 4. Create Schemas __init__.py
File: `app/schemas/__init__.py`
```python
from app.schemas.user import (
    UserBase,
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
)

__all__ = ["UserBase", "UserCreate", "UserLogin", "UserResponse", "Token"]
```

### 5. Update main.py for Database Initialization
```python
from shared.database import init_db
from app.models.user import User

# Initialize database tables
@app.on_event("startup")
async def startup_event():
    init_db()
```

## Deliverables
- [ ] User model created
- [ ] User schemas created
- [ ] Models __init__.py updated
- [ ] Schemas __init__.py updated
- [ ] Database initialization added to main.py

## Next Phase
Phase 3: Security Implementation
