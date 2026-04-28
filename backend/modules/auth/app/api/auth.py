"""Auth API endpoints."""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from shared.database import get_db
from shared.security import create_access_token
from shared.config_loader import load_config
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.crud.user import create_user, authenticate_user, get_user_by_email
from app.core.deps import get_current_user
from app.core.logger import logger
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

config = load_config()
ACCESS_TOKEN_EXPIRE_MINUTES = config.get_int("security.access_token_expire_minutes", 30)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, request: Request, db: Session = Depends(get_db)):
    """Register a new user.

    Args:
        user: User creation data.
        request: FastAPI request.
        db: Database session.

    Returns:
        Created user.

    Raises:
        HTTPException: If email already registered.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"REGISTER|email={user.email}|ip={client_ip}")

    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        logger.error(f"REGISTER_FAIL|email={user.email}|reason=duplicate")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    created_user = create_user(db=db, user=user)
    logger.info(f"REGISTER_SUCCESS|user_id={created_user.id}|email={created_user.email}")
    return created_user


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Login and get JWT token.

    Args:
        user_credentials: User login credentials.
        request: FastAPI request.
        db: Database session.

    Returns:
        JWT access token.

    Raises:
        HTTPException: If credentials are invalid.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"LOGIN|email={user_credentials.email}|ip={client_ip}")

    user = authenticate_user(db, email=user_credentials.email, password=user_credentials.password)
    if not user:
        logger.error(f"LOGIN_FAIL|email={user_credentials.email}|reason=invalid_credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    logger.info(f"LOGIN_SUCCESS|user_id={user.id}|email={user.email}")
    return Token(access_token=access_token)


@router.post("/refresh", response_model=Token)
async def refresh_token(request: Request, current_user: User = Depends(get_current_user)):
    """Refresh JWT token.

    Args:
        request: FastAPI request.
        current_user: Current authenticated user.

    Returns:
        New JWT access token.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"REFRESH|user_id={current_user.id}|ip={client_ip}")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.email}, expires_delta=access_token_expires
    )

    logger.info(f"REFRESH_SUCCESS|user_id={current_user.id}")
    return Token(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(request: Request, current_user: User = Depends(get_current_user)):
    """Get current user information.

    Args:
        request: FastAPI request.
        current_user: Current authenticated user.

    Returns:
        Current user information.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"GET_ME|user_id={current_user.id}|ip={client_ip}")
    logger.info(f"GET_ME_SUCCESS|user_id={current_user.id}")
    return current_user
