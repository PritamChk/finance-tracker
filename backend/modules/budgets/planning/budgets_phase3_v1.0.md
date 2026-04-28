# Budgets Module - Phase 3 v1.0

## Overview
Create API endpoints for budget management and write tests.

## Goals
- Create list budgets endpoint
- Create create budget endpoint
- Create get budget endpoint
- Create update budget endpoint
- Create delete budget endpoint
- Create budget progress endpoint
- Write comprehensive tests

## Prerequisites
- Phase 2 completed

## Implementation Steps

### 1. Create Budgets Endpoints
File: `app/api/budgets.py`
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from shared.database import get_db
from app.schemas.budget import (
    BudgetCreate,
    BudgetUpdate,
    BudgetResponse,
    BudgetProgress,
)
from app.crud.budget import (
    get_budget,
    get_budgets_by_user,
    create_budget,
    update_budget,
    delete_budget,
    calculate_budget_progress,
)

router = APIRouter(prefix="/api/budgets", tags=["budgets"])


@router.get("", response_model=list[BudgetResponse])
async def list_budgets(user_id: int, db: Session = Depends(get_db)):
    """List all budgets for a user.

    Args:
        user_id: User ID.
        db: Database session.

    Returns:
        List of budgets.
    """
    return get_budgets_by_user(db, user_id=user_id)


@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_budget_endpoint(budget: BudgetCreate, db: Session = Depends(get_db)):
    """Create a new budget.

    Args:
        budget: Budget creation data.
        db: Database session.

    Returns:
        Created budget.
    """
    return create_budget(db=db, budget=budget)


@router.get("/{budget_id}", response_model=BudgetResponse)
async def get_budget_endpoint(budget_id: int, db: Session = Depends(get_db)):
    """Get budget by ID.

    Args:
        budget_id: Budget ID.
        db: Database session.

    Returns:
        Budget details.

    Raises:
        HTTPException: If budget not found.
    """
    budget = get_budget(db, budget_id=budget_id)
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )
    return budget


@router.put("/{budget_id}", response_model=BudgetResponse)
async def update_budget_endpoint(
    budget_id: int, budget_update: BudgetUpdate, db: Session = Depends(get_db)
):
    """Update budget.

    Args:
        budget_id: Budget ID.
        budget_update: Budget update data.
        db: Database session.

    Returns:
        Updated budget.

    Raises:
        HTTPException: If budget not found.
    """
    budget = update_budget(db, budget_id=budget_id, budget_update=budget_update)
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )
    return budget


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget_endpoint(budget_id: int, db: Session = Depends(get_db)):
    """Delete budget.

    Args:
        budget_id: Budget ID.
        db: Database session.

    Raises:
        HTTPException: If budget not found.
    """
    success = delete_budget(db, budget_id=budget_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )


@router.get("/{budget_id}/progress", response_model=BudgetProgress)
async def get_budget_progress_endpoint(budget_id: int, db: Session = Depends(get_db)):
    """Get budget progress.

    Args:
        budget_id: Budget ID.
        db: Database session.

    Returns:
        Budget progress.

    Raises:
        HTTPException: If budget not found.
    """
    progress = calculate_budget_progress(db, budget_id=budget_id)
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )
    return progress
```

### 2. Register Router in main.py
```python
from app.api.budgets import router as budgets_router

app.include_router(budgets_router)
```

### 3. Write Tests
File: `tests/test_budgets.py`
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_budget():
    """Test budget creation."""
    response = client.post(
        "/api/budgets",
        json={
            "user_id": 1,
            "name": "Monthly Food",
            "amount": 500.00,
            "period": "monthly",
            "start_date": "2024-01-01T00:00:00"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Monthly Food"
    assert data["amount"] == 500.00
    assert "id" in data


def test_list_budgets():
    """Test listing budgets."""
    response = client.get("/api/budgets?user_id=1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_budget():
    """Test getting a budget by ID."""
    create_response = client.post(
        "/api/budgets",
        json={
            "user_id": 1,
            "name": "Transport",
            "amount": 200.00,
            "period": "monthly",
            "start_date": "2024-01-01T00:00:00"
        }
    )
    budget_id = create_response.json()["id"]

    response = client.get(f"/api/budgets/{budget_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == budget_id


def test_get_budget_not_found():
    """Test getting a non-existent budget."""
    response = client.get("/api/budgets/99999")
    assert response.status_code == 404


def test_update_budget():
    """Test updating a budget."""
    create_response = client.post(
        "/api/budgets",
        json={
            "user_id": 1,
            "name": "Entertainment",
            "amount": 150.00,
            "period": "monthly",
            "start_date": "2024-01-01T00:00:00"
        }
    )
    budget_id = create_response.json()["id"]

    response = client.put(
        f"/api/budgets/{budget_id}",
        json={"amount": 200.00, "name": "Entertainment & Movies"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 200.00


def test_delete_budget():
    """Test deleting a budget."""
    create_response = client.post(
        "/api/budgets",
        json={
            "user_id": 1,
            "name": "To Delete",
            "amount": 100.00,
            "period": "monthly",
            "start_date": "2024-01-01T00:00:00"
        }
    )
    budget_id = create_response.json()["id"]

    response = client.delete(f"/api/budgets/{budget_id}")
    assert response.status_code == 204

    get_response = client.get(f"/api/budgets/{budget_id}")
    assert get_response.status_code == 404


def test_budget_progress():
    """Test budget progress endpoint."""
    create_response = client.post(
        "/api/budgets",
        json={
            "user_id": 1,
            "name": "Test Budget",
            "amount": 1000.00,
            "period": "monthly",
            "start_date": "2024-01-01T00:00:00"
        }
    )
    budget_id = create_response.json()["id"]

    response = client.get(f"/api/budgets/{budget_id}/progress")
    assert response.status_code == 200
    data = response.json()
    assert "spent" in data
    assert "remaining" in data
    assert "percentage" in data
```

### 4. Run Tests
```bash
uv run pytest tests/ -v
```

## Deliverables
- [ ] List budgets endpoint created
- [ ] Create budget endpoint created
- [ ] Get budget endpoint created
- [ ] Update budget endpoint created
- [ ] Delete budget endpoint created
- [ ] Budget progress endpoint created
- [ ] All tests passing
- [ ] Swagger UI shows all endpoints

## Verification

### Manual Testing
1. Start server: `./run.sh`
2. Visit http://localhost:8004/docs
3. Test all endpoints via Swagger UI

### API Endpoints
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/{id}` - Get budget details
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget
- `GET /api/budgets/{id}/progress` - Get budget progress

## Module Complete
Budgets module is now complete and ready for integration with other modules.
