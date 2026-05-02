"""CRUD operation tests for auth module."""

import pytest
from auth_app.crud.user import create_user, get_user_by_email, get_user_by_id, authenticate_user
from auth_app.schemas.user import UserCreate


class TestCreateUser:
    """Test cases for create_user function."""

    def test_create_user_success(self, db_session, test_user_data):
        """Test creating a valid user."""
        user_create = UserCreate(**test_user_data)
        user = create_user(db=db_session, user=user_create)

        assert user.id is not None
        assert user.email == test_user_data["email"]
        assert user.hashed_password != test_user_data["password"]
        assert user.full_name is None

    def test_create_user_with_full_name(self, db_session):
        """Test creating a user with full name."""
        user_data = {
            "email": "test@example.com",
            "password": "testpass123",
            "full_name": "Test User"
        }
        user_create = UserCreate(**user_data)
        user = create_user(db=db_session, user=user_create)

        assert user.full_name == "Test User"

    def test_create_user_duplicate_email(self, db_session, test_user_data):
        """Test creating user with duplicate email."""
        user_create = UserCreate(**test_user_data)
        create_user(db=db_session, user=user_create)

        # Try to create another user with same email
        with pytest.raises(Exception):  # SQLAlchemy will raise IntegrityError
            create_user(db=db_session, user=user_create)


class TestGetUserByEmail:
    """Test cases for get_user_by_email function."""

    def test_get_user_by_email_success(self, db_session, test_user_data):
        """Test finding user by email."""
        user_create = UserCreate(**test_user_data)
        created_user = create_user(db=db_session, user=user_create)

        found_user = get_user_by_email(db=db_session, email=test_user_data["email"])

        assert found_user is not None
        assert found_user.id == created_user.id
        assert found_user.email == test_user_data["email"]

    def test_get_user_by_email_not_found(self, db_session):
        """Test finding nonexistent user by email."""
        user = get_user_by_email(db=db_session, email="nonexistent@example.com")
        assert user is None


class TestGetUserById:
    """Test cases for get_user_by_id function."""

    def test_get_user_by_id_success(self, db_session, test_user_data):
        """Test finding user by ID."""
        user_create = UserCreate(**test_user_data)
        created_user = create_user(db=db_session, user=user_create)

        found_user = get_user_by_id(db=db_session, user_id=created_user.id)

        assert found_user is not None
        assert found_user.id == created_user.id
        assert found_user.email == test_user_data["email"]

    def test_get_user_by_id_not_found(self, db_session):
        """Test finding nonexistent user by ID."""
        user = get_user_by_id(db=db_session, user_id=99999)
        assert user is None


class TestAuthenticateUser:
    """Test cases for authenticate_user function."""

    def test_authenticate_user_success(self, db_session, test_user_data):
        """Test authenticating user with valid credentials."""
        user_create = UserCreate(**test_user_data)
        create_user(db=db_session, user=user_create)

        authenticated_user = authenticate_user(
            db=db_session,
            email=test_user_data["email"],
            password=test_user_data["password"]
        )

        assert authenticated_user is not None
        assert authenticated_user.email == test_user_data["email"]

    def test_authenticate_user_wrong_password(self, db_session, test_user_data):
        """Test authenticating user with wrong password."""
        user_create = UserCreate(**test_user_data)
        create_user(db=db_session, user=user_create)

        authenticated_user = authenticate_user(
            db=db_session,
            email=test_user_data["email"],
            password="wrongpassword"
        )

        assert authenticated_user is None

    def test_authenticate_user_nonexistent_user(self, db_session):
        """Test authenticating nonexistent user."""
        authenticated_user = authenticate_user(
            db=db_session,
            email="nonexistent@example.com",
            password="testpass123"
        )

        assert authenticated_user is None

    def test_authenticate_user_case_sensitive_email(self, db_session, test_user_data):
        """Test that email authentication is case sensitive."""
        user_create = UserCreate(**test_user_data)
        create_user(db=db_session, user=user_create)

        # Try with different case
        authenticated_user = authenticate_user(
            db=db_session,
            email=test_user_data["email"].upper(),
            password=test_user_data["password"]
        )

        assert authenticated_user is None
