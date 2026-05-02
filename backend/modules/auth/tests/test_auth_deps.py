"""Dependency tests for auth module."""

import pytest
import asyncio
from fastapi import HTTPException, status
from auth_app.core.deps import get_current_user
from auth_app.crud.user import create_user
from auth_app.schemas.user import UserCreate
from shared.security import create_access_token


class TestGetCurrentUser:
    """Test cases for get_current_user dependency."""

    def test_get_current_user_valid_token(self, db_session, test_user_data):
        """Test getting current user with valid token."""
        # Create user
        user_create = UserCreate(**test_user_data)
        user = create_user(db=db_session, user=user_create)

        # Create token
        token = create_access_token(data={"sub": user.email})

        # Mock credentials
        from fastapi.security import HTTPAuthorizationCredentials
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )

        # Get current user
        current_user = get_current_user(credentials=credentials, db=db_session)

        assert current_user is not None
        assert current_user.id == user.id
        assert current_user.email == user.email

    def test_get_current_user_invalid_token(self, db_session):
        """Test getting current user with invalid token."""
        from fastapi.security import HTTPAuthorizationCredentials

        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="invalid_token"
        )

        with pytest.raises(HTTPException) as exc:
            get_current_user(credentials=credentials, db=db_session)

        assert exc.value.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user_expired_token(self, db_session, test_user_data):
        """Test getting current user with expired token."""
        from datetime import timedelta
        from fastapi.security import HTTPAuthorizationCredentials

        # Create user
        user_create = UserCreate(**test_user_data)
        user = create_user(db=db_session, user=user_create)

        # Create expired token
        token = create_access_token(
            data={"sub": user.email},
            expires_delta=timedelta(seconds=-1)
        )

        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )

        with pytest.raises(HTTPException) as exc:
            get_current_user(credentials=credentials, db=db_session)

        assert exc.value.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user_user_not_found(self, db_session):
        """Test getting current user when user doesn't exist."""
        from fastapi.security import HTTPAuthorizationCredentials

        # Create token for nonexistent user
        token = create_access_token(data={"sub": "nonexistent@example.com"})

        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )

        with pytest.raises(HTTPException) as exc:
            get_current_user(credentials=credentials, db=db_session)

        assert exc.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "User not found" in exc.value.detail

    def test_get_current_user_token_without_subject(self, db_session):
        """Test getting current user when token has no subject."""
        from fastapi.security import HTTPAuthorizationCredentials

        # Create token without subject
        token = create_access_token(data={"other": "data"})

        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )

        with pytest.raises(HTTPException) as exc:
            get_current_user(credentials=credentials, db=db_session)

        assert exc.value.status_code == status.HTTP_401_UNAUTHORIZED


class TestGetDbSession:
    """Test cases for get_db dependency."""

    def test_get_db_session(self, db_session):
        """Test that get_db returns a valid session."""
        assert db_session is not None
        assert hasattr(db_session, 'query')
        assert hasattr(db_session, 'commit')
        assert hasattr(db_session, 'rollback')

    def test_db_session_can_query(self, db_session):
        """Test that db session can perform queries."""
        from auth_app.models.user import User

        # Query should work even if empty
        users = db_session.query(User).all()
        assert isinstance(users, list)

    def test_db_session_can_add(self, db_session, test_user_data):
        """Test that db session can add records."""
        from auth_app.models.user import User
        from shared.security import get_password_hash

        user = User(
            email=test_user_data["email"],
            hashed_password=get_password_hash(test_user_data["password"])
        )
        db_session.add(user)
        db_session.commit()

        retrieved_user = db_session.query(User).filter(
            User.email == test_user_data["email"]
        ).first()

        assert retrieved_user is not None
        assert retrieved_user.email == test_user_data["email"]
