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
    """Get financial summary."""
    return get_summary(db, user_id, start_date, end_date)

@router.get("/spending-by-category")
async def spending_by_category_endpoint(
    user_id: int = Query(..., description="User ID"),
    start_date: datetime | None = Query(None, description="Start date"),
    end_date: datetime | None = Query(None, description="End date"),
    db: Session = Depends(get_db),
):
    """Get spending breakdown by category."""
    return get_spending_by_category(db, user_id, start_date, end_date)

@router.get("/monthly-trend")
async def monthly_trend_endpoint(
    user_id: int = Query(..., description="User ID"),
    months: int = Query(12, ge=1, le=24, description="Number of months"),
    db: Session = Depends(get_db),
):
    """Get monthly spending trend."""
    return get_monthly_trend(db, user_id, months)

@router.get("/income-vs-expense")
async def income_vs_expense_endpoint(
    user_id: int = Query(..., description="User ID"),
    start_date: datetime | None = Query(None, description="Start date"),
    end_date: datetime | None = Query(None, description="End date"),
    db: Session = Depends(get_db),
):
    """Get income vs expense comparison."""
    return get_income_vs_expense(db, user_id, start_date, end_date)
