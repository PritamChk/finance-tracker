import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_summary():
    """Test summary endpoint."""
    response = client.get("/api/analytics/summary?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert "total_income" in data
    assert "total_expense" in data
    assert "balance" in data

def test_summary_with_date_range():
    """Test summary with date range."""
    response = client.get(
        "/api/analytics/summary?user_id=1&start_date=2024-01-01T00:00:00&end_date=2024-01-31T23:59:59"
    )
    assert response.status_code == 200

def test_spending_by_category():
    """Test spending by category endpoint."""
    response = client.get("/api/analytics/spending-by-category?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_monthly_trend():
    """Test monthly trend endpoint."""
    response = client.get("/api/analytics/monthly-trend?user_id=1&months=6")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_income_vs_expense():
    """Test income vs expense endpoint."""
    response = client.get("/api/analytics/income-vs-expense?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert "income" in data
    assert "expense" in data
