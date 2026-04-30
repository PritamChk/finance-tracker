import pytest
from fastapi.testclient import TestClient


def test_create_transaction(client):
    """Test transaction creation."""
    response = client.post(
        "/api/transactions",
        json={
            "user_id": 1,
            "category_id": 1,
            "type": "expense",
            "amount": 50.00,
            "description": "Lunch",
            "date": "2024-01-15T12:00:00"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 50.00
    assert data["type"] == "expense"
    assert "id" in data


def test_list_transactions(client):
    """Test listing transactions."""
    # Create a transaction first
    client.post(
        "/api/transactions",
        json={
            "user_id": 1,
            "category_id": 1,
            "type": "expense",
            "amount": 50.00,
            "description": "Lunch",
            "date": "2024-01-15T12:00:00"
        }
    )
    response = client.get("/api/transactions?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data


def test_list_transactions_with_filters(client):
    """Test listing transactions with filters."""
    # Create transactions
    client.post(
        "/api/transactions",
        json={
            "user_id": 1,
            "type": "expense",
            "amount": 50.00,
            "description": "Lunch",
            "date": "2024-01-15T12:00:00"
        }
    )
    client.post(
        "/api/transactions",
        json={
            "user_id": 1,
            "type": "income",
            "amount": 100.00,
            "description": "Salary",
            "date": "2024-01-15T12:00:00"
        }
    )
    response = client.get("/api/transactions?user_id=1&transaction_type=expense")
    assert response.status_code == 200
    data = response.json()
    assert all(t["type"] == "expense" for t in data["items"])


def test_get_transaction(client):
    """Test getting a transaction by ID."""
    create_response = client.post(
        "/api/transactions",
        json={
            "user_id": 1,
            "type": "income",
            "amount": 1000.00,
            "description": "Salary",
            "date": "2024-01-01T00:00:00"
        }
    )
    transaction_id = create_response.json()["id"]

    response = client.get(f"/api/transactions/{transaction_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == transaction_id


def test_get_transaction_not_found(client):
    """Test getting a non-existent transaction."""
    response = client.get("/api/transactions/99999")
    assert response.status_code == 404


def test_update_transaction(client):
    """Test updating a transaction."""
    create_response = client.post(
        "/api/transactions",
        json={
            "user_id": 1,
            "type": "expense",
            "amount": 25.00,
            "description": "Coffee",
            "date": "2024-01-15T09:00:00"
        }
    )
    transaction_id = create_response.json()["id"]

    response = client.put(
        f"/api/transactions/{transaction_id}",
        json={"amount": 30.00, "description": "Coffee and pastry"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 30.00


def test_delete_transaction(client):
    """Test deleting a transaction."""
    create_response = client.post(
        "/api/transactions",
        json={
            "user_id": 1,
            "type": "expense",
            "amount": 15.00,
            "description": "Snack",
            "date": "2024-01-15T15:00:00"
        }
    )
    transaction_id = create_response.json()["id"]

    response = client.delete(f"/api/transactions/{transaction_id}")
    assert response.status_code == 204

    get_response = client.get(f"/api/transactions/{transaction_id}")
    assert get_response.status_code == 404


def test_transaction_summary(client):
    """Test transaction summary endpoint."""
    # Create some transactions
    client.post(
        "/api/transactions",
        json={
            "user_id": 1,
            "type": "income",
            "amount": 1000.00,
            "description": "Salary",
            "date": "2024-01-01T00:00:00"
        }
    )
    client.post(
        "/api/transactions",
        json={
            "user_id": 1,
            "type": "expense",
            "amount": 200.00,
            "description": "Rent",
            "date": "2024-01-15T00:00:00"
        }
    )
    response = client.get("/api/transactions/summary?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert "total_income" in data
    assert "total_expense" in data
    assert "balance" in data
    assert data["total_income"] == 1000.00
    assert data["total_expense"] == 200.00
    assert data["balance"] == 800.00
