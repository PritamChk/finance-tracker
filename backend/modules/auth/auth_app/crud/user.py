"""User CRUD operations."""

from sqlalchemy.orm import Session
from auth_app.models.user import User
from auth_app.schemas.user import UserCreate
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
        hashed_password=hashed_password,
        full_name=user.full_name,
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
    if not verify_password(password, user.hashed_password):
        return None
    return user
