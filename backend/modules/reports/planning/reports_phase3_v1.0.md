# Reports Module - Phase 3 v1.0

## Overview
Create API endpoints for reports and write tests.

## Goals
- Create CSV export endpoint
- Create JSON export endpoint
- Create monthly report endpoint
- Create yearly report endpoint
- Write comprehensive tests

## Prerequisites
- Phase 2 completed

## Implementation Steps

### 1. Create Reports Endpoints
File: `app/api/reports.py`
```python
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime
from shared.database import get_db
from app.crud.reports import (
    export_transactions_csv,
    export_transactions_json,
    generate_monthly_report,
    generate_yearly_report,
)

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/export/csv")
async def export_csv_endpoint(
    user_id: int = Query(..., description="User ID"),
    start_date: datetime | None = Query(None, description="Start date"),
    end_date: datetime | None = Query(None, description="End date"),
    db: Session = Depends(get_db),
):
    """Export transactions as CSV.

    Args:
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.
        db: Database session.

    Returns:
        CSV file.
    """
    csv_data = export_transactions_csv(db, user_id, start_date, end_date)

    return StreamingResponse(
        iter([csv_data]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"},
    )


@router.get("/export/json")
async def export_json_endpoint(
    user_id: int = Query(..., description="User ID"),
    start_date: datetime | None = Query(None, description="Start date"),
    end_date: datetime | None = Query(None, description="End date"),
    db: Session = Depends(get_db),
):
    """Export transactions as JSON.

    Args:
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.
        db: Database session.

    Returns:
        JSON data.
    """
    return export_transactions_json(db, user_id, start_date, end_date)


@router.get("/monthly")
async def monthly_report_endpoint(
    user_id: int = Query(..., description="User ID"),
    year: int = Query(..., description="Year"),
    month: int = Query(..., ge=1, le=12, description="Month"),
    db: Session = Depends(get_db),
):
    """Generate monthly report.

    Args:
        user_id: User ID.
        year: Year.
        month: Month (1-12).
        db: Database session.

    Returns:
        Monthly report data.
    """
    return generate_monthly_report(db, user_id, year, month)


@router.get("/yearly")
async def yearly_report_endpoint(
    user_id: int = Query(..., description="User ID"),
    year: int = Query(..., description="Year"),
    db: Session = Depends(get_db),
):
    """Generate yearly report.

    Args:
        user_id: User ID.
        year: Year.
        db: Database session.

    Returns:
        Yearly report data.
    """
    return generate_yearly_report(db, user_id, year)
```

### 2. Register Router in main.py
```python
from app.api.reports import router as reports_router

app.include_router(reports_router)
```

### 3. Write Tests
File: `tests/test_reports.py`
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_export_csv():
    """Test CSV export endpoint."""
    response = client.get("/api/reports/export/csv?user_id=1")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv; charset=utf-8"


def test_export_json():
    """Test JSON export endpoint."""
    response = client.get("/api/reports/export/json?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert "transactions" in data
    assert "summary" in data


def test_monthly_report():
    """Test monthly report endpoint."""
    response = client.get("/api/reports/monthly?user_id=1&year=2024&month=1")
    assert response.status_code == 200
    data = response.json()
    assert "month" in data
    assert "year" in data
    assert "summary" in data


def test_yearly_report():
    """Test yearly report endpoint."""
    response = client.get("/api/reports/yearly?user_id=1&year=2024")
    assert response.status_code == 200
    data = response.json()
    assert "year" in data
    assert "summary" in data
    assert "monthly_breakdown" in data


def test_export_with_date_range():
    """Test export with date range."""
    response = client.get(
        "/api/reports/export/json?user_id=1&start_date=2024-01-01T00:00:00&end_date=2024-01-31T23:59:59"
    )
    assert response.status_code == 200
```

### 4. Run Tests
```bash
uv run pytest tests/ -v
```

## Deliverables
- [ ] CSV export endpoint created
- [ ] JSON export endpoint created
- [ ] Monthly report endpoint created
- [ ] Yearly report endpoint created
- [ ] All tests passing
- [ ] Swagger UI shows all endpoints

## Verification

### Manual Testing
1. Start server: `./run.sh`
2. Visit http://localhost:8006/docs
3. Test all endpoints via Swagger UI

### API Endpoints
- `GET /api/reports/export/csv` - Export transactions as CSV
- `GET /api/reports/export/json` - Export transactions as JSON
- `GET /api/reports/monthly` - Generate monthly report
- `GET /api/reports/yearly` - Generate yearly report

## Module Complete
Reports module is now complete and ready for integration with other modules.
