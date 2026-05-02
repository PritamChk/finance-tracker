"""Schema validation tests for auth module."""

import pytest
from pydantic import ValidationError
from auth_app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from datetime import datetime


class TestUserCreateSchema:
    """Test cases for UserCreate schema."""

    def test_user_create_valid(self):
        """Test valid UserCreate schema."""
        data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        user = UserCreate(**data)

        assert user.email == "test@example.com"
        assert user.password == "testpass123"
        assert user.full_name is None

    def test_user_create_with_full_name(self):
        """Test UserCreate with full name."""
        data = {
            "email": "test@example.com",
            "password": "testpass123",
            "full_name": "Test User"
        }
        user = UserCreate(**data)

        assert user.full_name == "Test User"

    def test_user_create_missing_email(self):
        """Test UserCreate without email."""
        data = {"password": "testpass123"}

        with pytest.raises(ValidationError) as exc:
            UserCreate(**data)

        errors = exc.value.errors()
        assert any(error["loc"][0] == "email" for error in errors)

    def test_user_create_invalid_email(self):
        """Test UserCreate with invalid email format."""
        data = {
            "email": "invalid-email",
            "password": "testpass123"
        }

        with pytest.raises(ValidationError) as exc:
            UserCreate(**data)

        errors = exc.value.errors()
        assert any(error["loc"][0] == "email" for error in errors)

    def test_user_create_missing_password(self):
        """Test UserCreate without password."""
        data = {"email": "test@example.com"}

        with pytest.raises(ValidationError) as exc:
            UserCreate(**data)

        errors = exc.value.errors()
        assert any(error["loc"][0] == "password" for error in errors)

    def test_user_create_weak_password(self):
        """Test UserCreate with weak password."""
        data = {
            "email": "test@example.com",
            "password": "short"
        }

        with pytest.raises(ValidationError) as exc:
            UserCreate(**data)

        errors = exc.value.errors()
        assert any(error["loc"][0] == "password" for error in errors)

    def test_user_create_empty_email(self):
        """Test UserCreate with empty email."""
        data = {
            "email": "",
            "password": "testpass123"
        }

        with pytest.raises(ValidationError):
            UserCreate(**data)

    def test_user_create_empty_password(self):
        """Test UserCreate with empty password."""
        data = {
            "email": "test@example.com",
            "password": ""
        }

        with pytest.raises(ValidationError):
            UserCreate(**data)


class TestUserLoginSchema:
    """Test cases for UserLogin schema."""

    def test_user_login_valid(self):
        """Test valid UserLogin schema."""
        data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        user_login = UserLogin(**data)

        assert user_login.email == "test@example.com"
        assert user_login.password == "testpass123"

    def test_user_login_missing_email(self):
        """Test UserLogin without email."""
        data = {"password": "testpass123"}

        with pytest.raises(ValidationError) as exc:
            UserLogin(**data)

        errors = exc.value.errors()
        assert any(error["loc"][0] == "email" for error in errors)

    def test_user_login_missing_password(self):
        """Test UserLogin without password."""
        data = {"email": "test@example.com"}

        with pytest.raises(ValidationError) as exc:
            UserLogin(**data)

        errors = exc.value.errors()
        assert any(error["loc"][0] == "password" for error in errors)

    def test_user_login_invalid_email(self):
        """Test UserLogin with invalid email format."""
        data = {
            "email": "invalid-email",
            "password": "testpass123"
        }

        with pytest.raises(ValidationError):
            UserLogin(**data)


class TestTokenSchema:
    """Test cases for Token schema."""

    def test_token_response_structure(self):
        """Test Token schema has required fields."""
        data = {
            "access_token": "test_token_string",
            "token_type": "bearer"
        }
        token = Token(**data)

        assert token.access_token == "test_token_string"
        assert token.token_type == "bearer"

    def test_token_default_token_type(self):
        """Test Token schema default token_type."""
        data = {"access_token": "test_token_string"}
        token = Token(**data)

        assert token.token_type == "bearer"

    def test_token_missing_access_token(self):
        """Test Token without access_token."""
        data = {"token_type": "bearer"}

        with pytest.raises(ValidationError):
            Token(**data)


class TestUserResponseSchema:
    """Test cases for UserResponse schema."""

    def test_user_response_structure(self):
        """Test UserResponse schema has required fields."""
        data = {
            "id": 1,
            "email": "test@example.com",
            "full_name": "Test User",
            "created_at": datetime.now()
        }
        user_response = UserResponse(**data)

        assert user_response.id == 1
        assert user_response.email == "test@example.com"
        assert user_response.full_name == "Test User"
        assert isinstance(user_response.created_at, datetime)

    def test_user_response_with_none_full_name(self):
        """Test UserResponse with None full_name."""
        data = {
            "id": 1,
            "email": "test@example.com",
            "full_name": None,
            "created_at": datetime.now()
        }
        user_response = UserResponse(**data)

        assert user_response.full_name is None

    def test_user_response_from_attributes(self):
        """Test UserResponse from ORM model attributes."""
        from auth_app.models.user import User

        user = User(
            id=1,
            email="test@example.com",
            hashed_password="hashed",
            full_name="Test User",
            created_at=datetime.now()
        )

        user_response = UserResponse.model_validate(user)

        assert user_response.id == 1
        assert user_response.email == "test@example.com"
        assert user_response.full_name == "Test User"
