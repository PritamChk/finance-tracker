# Transactions Module - Phase 4 v1.0

## Overview
Create API endpoints for transaction management and write tests.

## Goals
- Create list transactions endpoint with pagination
- Create create transaction endpoint
- Create get transaction endpoint
- Create update transaction endpoint
- Create delete transaction endpoint
- Create transaction summary endpoint
- Write comprehensive tests

## Prerequisites
- Phase 3 completed

## Implementation Steps

### 1. Create Transactions Endpoints
File: `app/api/transactions.py`
```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
from shared.database import get_db
from app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionType,
)
from app.schemas.query import TransactionQueryParams
from app.schemas.pagination import PaginatedResponse
from app.crud.transaction import (
    get_transaction,
    get_transactions_by_user,
    create_transaction,
    update_transaction,
    delete_transaction,
    get_transactions_paginated,
    get_transaction_summary,
)

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("", response_model=PaginatedResponse[TransactionResponse])
async def list_transactions(params: TransactionQueryParams = Depends(), db: Session = Depends(get_db)):
    """List transactions with pagination and filtering.

    Args:
        params: Query parameters for filtering and pagination.
        db: Database session.

    Returns:
        Paginated response with transactions.
    """
    return get_transactions_paginated(db, params)


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction_endpoint(transaction: TransactionCreate, db: Session = Depends(get_db)):
    """Create a new transaction.

    Args:
        transaction: Transaction creation data.
        db: Database session.

    Returns:
        Created transaction.
    """
    return create_transaction(db=db, transaction=transaction)


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction_endpoint(transaction_id: int, db: Session = Depends(get_db)):
    """Get transaction by ID.

    Args:
        transaction_id: Transaction ID.
        db: Database session.

    Returns:
        Transaction details.

    Raises:
        HTTPException: If transaction not found.
    """
    transaction = get_transaction(db, transaction_id=transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction_endpoint(
    transaction_id: int, transaction_update: TransactionUpdate, db: Session = Depends(get_db)
):
    """Update transaction.

    Args:
        transaction_id: Transaction ID.
        transaction_update: Transaction update data.
        db: Database session.

    Returns:
        Updated transaction.

    Raises:
        HTTPException: If transaction not found.
    """
    transaction = update_transaction(
        db, transaction_id=transaction_id, transaction_update=transaction_update
    )
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction_endpoint(transaction_id: int, db: Session = Depends(get_db)):
    """Delete transaction.

    Args:
        transaction_id: Transaction ID.
        db: Database session.

    Raises:
        HTTPException: If transaction not found.
    """
    success = delete_transaction(db, transaction_id=transaction_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )


@router.get("/summary", response_model=dict)
async def get_transaction_summary_endpoint(
    user_id: int = Query(..., description="User ID"),
    start_date: datetime | None = Query(None, description="Start date"),
    end_date: datetime | None = Query(None, description="End date"),
    db: Session = Depends(get_db),
):
    """Get transaction summary for a user.

    Args:
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.
        db: Database session.

    Returns:
        Summary statistics.
    """
    return get_transaction_summary(db, user_id, start_date, end_date)
```

### 2. Register Router in main.py
```python
from app.api.transactions import router as transactions_router

app.include_router(transactions_router)
```

### 3. Write Tests
File: `tests/test_transactions.py`
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_transaction():
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


def test_list_transactions():
    """Test listing transactions."""
    response = client.get("/api/transactions?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data


def test_list_transactions_with_filters():
    """Test listing transactions with filters."""
    response = client.get("/api/transactions?user_id=1&transaction_type=expense")
    assert response.status_code == 200
    data = response.json()
    assert all(t["type"] == "expense" for t in data["items"])


def test_get_transaction():
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


def test_get_transaction_not_found():
    """Test getting a non-existent transaction."""
    response = client.get("/api/transactions/99999")
    assert response.status_code == 404


def test_update_transaction():
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


def test_delete_transaction():
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


def test_transaction_summary():
    """Test transaction summary endpoint."""
    response = client.get("/api/transactions/summary?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert "total_income" in data
    assert "total_expense" in data
    assert "balance" in data
```

### 4. Run Tests
```bash
uv run pytest tests/ -v
```

## Deliverables
- [ ] List transactions endpoint created
- [ ] Create transaction endpoint created
- [ ] Get transaction endpoint created
- [ ] Update transaction endpoint created
- [ ] Delete transaction endpoint created
- [ ] Transaction summary endpoint created
- [ ] All tests passing
- [ ] Swagger UI shows all endpoints

## Verification

### Manual Testing
1. Start server: `./run.sh`
2. Visit http://localhost:8003/docs
3. Test all endpoints via Swagger UI

### API Endpoints
- `GET /api/transactions` - List transactions with pagination and filters
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/{id}` - Get transaction details
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/summary` - Get transaction summary

## Module Complete
Transactions module is now complete and ready for integration with other modules.
