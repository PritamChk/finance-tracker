"""API endpoint tests for auth module."""

import pytest
from fastapi import status


class TestRegisterEndpoint:
    """Test cases for /api/auth/register endpoint."""

    def test_register_success(self, client):
        """Test valid registration."""
        response = client.post(
            "/api/auth/register",
            json={"email": "test@example.com", "password": "testpass123"}
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["email"] == "test@example.com"
        assert "id" in data
        assert "created_at" in data

    def test_register_duplicate_email(self, client):
        """Test registration with duplicate email."""
        client.post(
            "/api/auth/register",
            json={"email": "test@example.com", "password": "testpass123"}
        )
        response = client.post(
            "/api/auth/register",
            json={"email": "test@example.com", "password": "differentpass"}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already registered" in response.json()["detail"]

    def test_register_invalid_email(self, client):
        """Test registration with invalid email format."""
        response = client.post(
            "/api/auth/register",
            json={"email": "invalid-email", "password": "testpass123"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_missing_email(self, client):
        """Test registration without email."""
        response = client.post(
            "/api/auth/register",
            json={"password": "testpass123"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_missing_password(self, client):
        """Test registration without password."""
        response = client.post(
            "/api/auth/register",
            json={"email": "test@example.com"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_weak_password(self, client):
        """Test registration with weak password."""
        response = client.post(
            "/api/auth/register",
            json={"email": "test@example.com", "password": "short"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_with_full_name(self, client):
        """Test registration with full name."""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "test@example.com",
                "password": "testpass123",
                "full_name": "Test User"
            }
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["full_name"] == "Test User"


class TestLoginEndpoint:
    """Test cases for /api/auth/login endpoint."""

    def test_login_success(self, client, test_user_data):
        """Test valid login."""
        # First register
        client.post("/api/auth/register", json=test_user_data)

        # Then login
        response = client.post(
            "/api/auth/login",
            json=test_user_data
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, test_user_data):
        """Test login with wrong password."""
        # Register user
        client.post("/api/auth/register", json=test_user_data)

        # Try login with wrong password
        response = client.post(
            "/api/auth/login",
            json={"email": test_user_data["email"], "password": "wrongpass"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Incorrect email or password" in response.json()["detail"]

    def test_login_nonexistent_user(self, client):
        """Test login with nonexistent user."""
        response = client.post(
            "/api/auth/login",
            json={"email": "nonexistent@example.com", "password": "testpass123"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_missing_email(self, client):
        """Test login without email."""
        response = client.post(
            "/api/auth/login",
            json={"password": "testpass123"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_login_missing_password(self, client):
        """Test login without password."""
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestRefreshEndpoint:
    """Test cases for /api/auth/refresh endpoint."""

    def test_refresh_success(self, client, test_user_data):
        """Test valid token refresh."""
        # Register and login
        client.post("/api/auth/register", json=test_user_data)
        login_response = client.post("/api/auth/login", json=test_user_data)
        token = login_response.json()["access_token"]

        # Refresh token
        response = client.post(
            "/api/auth/refresh",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_refresh_invalid_token(self, client):
        """Test refresh with invalid token."""
        response = client.post(
            "/api/auth/refresh",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_refresh_no_token(self, client):
        """Test refresh without token."""
        response = client.post("/api/auth/refresh")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestGetMeEndpoint:
    """Test cases for /api/auth/me endpoint."""

    def test_get_me_success(self, client, test_user_data):
        """Test getting current user with valid token."""
        # Register and login
        client.post("/api/auth/register", json=test_user_data)
        login_response = client.post("/api/auth/login", json=test_user_data)
        token = login_response.json()["access_token"]

        # Get current user
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert "id" in data

    def test_get_me_no_token(self, client):
        """Test getting current user without token."""
        response = client.get("/api/auth/me")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_me_invalid_token(self, client):
        """Test getting current user with invalid token."""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_me_malformed_token(self, client):
        """Test getting current user with malformed token."""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "InvalidFormat token"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
