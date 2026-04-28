# Analytics Module - Phase 3 v1.0

## Overview
Create API endpoints for analytics and write tests.

## Goals
- Create summary endpoint
- Create spending by category endpoint
- Create monthly trend endpoint
- Create income vs expense endpoint
- Write comprehensive tests

## Prerequisites
- Phase 2 completed

## Implementation Steps

### 1. Create Analytics Endpoints
File: `app/api/analytics.py`
```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from shared.database import get_db
from app.crud.analytics import (
    get_summary,
    get_spending_by_category,
    get_monthly_trend,
    get_income_vs_expense,
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary")
async def summary_endpoint(
    user_id: int = Query(..., description="User ID"),
    start_date: datetime | None = Query(None, description="Start date"),
    end_date: datetime | None = Query(None, description="End date"),
    db: Session = Depends(get_db),
):
    """Get financial summary.

    Args:
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.
        db: Database session.

    Returns:
        Summary statistics.
    """
    return get_summary(db, user_id, start_date, end_date)


@router.get("/spending-by-category")
async def spending_by_category_endpoint(
    user_id: int = Query(..., description="User ID"),
    start_date: datetime | None = Query(None, description="Start date"),
    end_date: datetime | None = Query(None, description="End date"),
    db: Session = Depends(get_db),
):
    """Get spending breakdown by category.

    Args:
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.
        db: Database session.

    Returns:
        List of category spending.
    """
    return get_spending_by_category(db, user_id, start_date, end_date)


@router.get("/monthly-trend")
async def monthly_trend_endpoint(
    user_id: int = Query(..., description="User ID"),
    months: int = Query(12, ge=1, le=24, description="Number of months"),
    db: Session = Depends(get_db),
):
    """Get monthly spending trend.

    Args:
        user_id: User ID.
        months: Number of months to include.
        db: Database session.

    Returns:
        Monthly trend data.
    """
    return get_monthly_trend(db, user_id, months)


@router.get("/income-vs-expense")
async def income_vs_expense_endpoint(
    user_id: int = Query(..., description="User ID"),
    start_date: datetime | None = Query(None, description="Start date"),
    end_date: datetime | None = Query(None, description="End date"),
    db: Session = Depends(get_db),
):
    """Get income vs expense comparison.

    Args:
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.
        db: Database session.

    Returns:
        Income vs expense data.
    """
    return get_income_vs_expense(db, user_id, start_date, end_date)
```

### 2. Register Router in main.py
```python
from app.api.analytics import router as analytics_router

app.include_router(analytics_router)
```

### 3. Write Tests
File: `tests/test_analytics.py`
```python
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
```

### 4. Run Tests
```bash
uv run pytest tests/ -v
```

## Deliverables
- [ ] Summary endpoint created
- [ ] Spending by category endpoint created
- [ ] Monthly trend endpoint created
- [ ] Income vs expense endpoint created
- [ ] All tests passing
- [ ] Swagger UI shows all endpoints

## Verification

### Manual Testing
1. Start server: `./run.sh`
2. Visit http://localhost:8005/docs
3. Test all endpoints via Swagger UI

### API Endpoints
- `GET /api/analytics/summary` - Get financial summary
- `GET /api/analytics/spending-by-category` - Get spending by category
- `GET /api/analytics/monthly-trend` - Get monthly trend
- `GET /api/analytics/income-vs-expense` - Get income vs expense

## Module Complete
Analytics module is now complete and ready for integration with other modules.
