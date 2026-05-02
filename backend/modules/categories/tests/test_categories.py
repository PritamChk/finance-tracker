import sys
from pathlib import Path

backend_root = Path(__file__).parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

import pytest
from fastapi.testclient import TestClient
from categories_app.main import app
import categories_app.database as database_module


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Initialize database before tests."""
    database_module.init_db()


client = TestClient(app)


def test_create_category():
    """Test category creation."""
    response = client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Food",
            "type": "expense",
            "color": "#ef4444"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Food"
    assert data["type"] == "expense"
    assert data["color"] == "#ef4444"
    assert "id" in data


def test_list_categories():
    """Test listing categories."""
    client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Transport",
            "type": "expense",
            "color": "#3b82f6"
        }
    )

    response = client.get("/api/categories?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(cat["name"] == "Transport" for cat in data)


def test_list_categories_by_type():
    """Test listing categories filtered by type."""
    client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Salary",
            "type": "income",
            "color": "#22c55e"
        }
    )
    client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Rent",
            "type": "expense",
            "color": "#ef4444"
        }
    )

    response = client.get("/api/categories?user_id=1&category_type=income")
    assert response.status_code == 200
    data = response.json()
    assert all(cat["type"] == "income" for cat in data)


def test_get_category():
    """Test getting a category by ID."""
    create_response = client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Utilities",
            "type": "expense",
            "color": "#f59e0b"
        }
    )
    category_id = create_response.json()["id"]

    response = client.get(f"/api/categories/{category_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == category_id
    assert data["name"] == "Utilities"


def test_get_category_not_found():
    """Test getting a non-existent category."""
    response = client.get("/api/categories/99999")
    assert response.status_code == 404


def test_update_category():
    """Test updating a category."""
    create_response = client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Entertainment",
            "type": "expense",
            "color": "#8b5cf6"
        }
    )
    category_id = create_response.json()["id"]

    response = client.put(
        f"/api/categories/{category_id}",
        json={"name": "Movies", "color": "#ec4899"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Movies"
    assert data["color"] == "#ec4899"


def test_delete_category():
    """Test deleting a category."""
    create_response = client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "To Delete",
            "type": "expense",
            "color": "#6b7280"
        }
    )
    category_id = create_response.json()["id"]

    response = client.delete(f"/api/categories/{category_id}")
    assert response.status_code == 204

    get_response = client.get(f"/api/categories/{category_id}")
    assert get_response.status_code == 404