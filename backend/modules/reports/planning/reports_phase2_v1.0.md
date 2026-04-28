# Reports Module - Phase 2 v1.0

## Overview
Implement report generation functions for data export and aggregation.

## Goals
- Implement CSV export function
- Implement JSON export function
- Implement monthly report generation
- Implement yearly report generation

## Prerequisites
- Phase 1 completed
- Transactions module completed (for transaction data)

## Implementation Steps

### 1. Create Reports Schemas
File: `app/schemas/reports.py`
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class TransactionExport(BaseModel):
    """Schema for transaction export."""

    id: int = Field(..., description="Transaction ID")
    date: str = Field(..., description="Transaction date")
    type: str = Field(..., description="Transaction type")
    amount: float = Field(..., description="Transaction amount")
    description: Optional[str] = Field(None, description="Transaction description")
    category_name: Optional[str] = Field(None, description="Category name")


class ExportResponse(BaseModel):
    """Schema for export response."""

    transactions: List[TransactionExport] = Field(..., description="List of transactions")
    summary: dict = Field(..., description="Summary statistics")
    export_date: str = Field(..., description="Export timestamp")


class MonthlyReport(BaseModel):
    """Schema for monthly report."""

    year: int = Field(..., description="Year")
    month: int = Field(..., description="Month")
    summary: dict = Field(..., description="Monthly summary")
    top_categories: List[dict] = Field(..., description="Top spending categories")
    daily_breakdown: List[dict] = Field(..., description="Daily breakdown")


class YearlyReport(BaseModel):
    """Schema for yearly report."""

    year: int = Field(..., description="Year")
    summary: dict = Field(..., description="Yearly summary")
    monthly_breakdown: List[dict] = Field(..., description="Monthly breakdown")
    top_categories: List[dict] = Field(..., description="Top spending categories")
```

### 2. Create Reports CRUD Functions
File: `app/crud/reports.py`
```python
import csv
import io
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.reports import TransactionExport, ExportResponse


def export_transactions_csv(
    db: Session,
    user_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> str:
    """Export transactions as CSV.

    Args:
        db: Database session.
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.

    Returns:
        CSV string.
    """
    query = (
        db.query(Transaction, Category.name.label("category_name"))
        .join(Category, Transaction.category_id == Category.id, isouter=True)
        .filter(Transaction.user_id == user_id)
    )

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    results = query.order_by(Transaction.date.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Write header
    writer.writerow(["ID", "Date", "Type", "Amount", "Description", "Category"])

    # Write rows
    for transaction, category_name in results:
        writer.writerow([
            transaction.id,
            transaction.date.strftime("%Y-%m-%d"),
            transaction.type,
            transaction.amount,
            transaction.description or "",
            category_name or "Uncategorized",
        ])

    return output.getvalue()


def export_transactions_json(
    db: Session,
    user_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> dict:
    """Export transactions as JSON.

    Args:
        db: Database session.
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.

    Returns:
        JSON export data.
    """
    query = (
        db.query(Transaction, Category.name.label("category_name"))
        .join(Category, Transaction.category_id == Category.id, isouter=True)
        .filter(Transaction.user_id == user_id)
    )

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    results = query.order_by(Transaction.date.desc()).all()

    transactions = [
        TransactionExport(
            id=t.id,
            date=t.date.strftime("%Y-%m-%d"),
            type=t.type,
            amount=float(t.amount),
            description=t.description,
            category_name=category_name,
        )
        for t, category_name in results
    ]

    # Calculate summary
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")

    summary = {
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "balance": float(total_income - total_expense),
        "transaction_count": len(transactions),
    }

    return ExportResponse(
        transactions=transactions,
        summary=summary,
        export_date=datetime.now().isoformat(),
    ).model_dump()


def generate_monthly_report(
    db: Session, user_id: int, year: int, month: int
) -> dict:
    """Generate monthly report.

    Args:
        db: Database session.
        user_id: User ID.
        year: Year.
        month: Month (1-12).

    Returns:
        Monthly report data.
    """
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    query = (
        db.query(Transaction, Category.name.label("category_name"))
        .join(Category, Transaction.category_id == Category.id, isouter=True)
        .filter(
            Transaction.user_id == user_id,
            Transaction.date >= start_date,
            Transaction.date < end_date,
        )
    )

    results = query.all()

    # Calculate summary
    total_income = sum(t.amount for t, _ in results if t.type == "income")
    total_expense = sum(t.amount for t, _ in results if t.type == "expense")

    # Top categories
    category_spending = {}
    for t, category_name in results:
        if t.type == "expense":
            cat_name = category_name or "Uncategorized"
            category_spending[cat_name] = category_spending.get(cat_name, 0) + t.amount

    top_categories = [
        {"category": cat, "amount": float(amount)}
        for cat, amount in sorted(category_spending.items(), key=lambda x: x[1], reverse=True)[:5]
    ]

    # Daily breakdown
    daily_breakdown = {}
    for t, _ in results:
        day = t.date.strftime("%Y-%m-%d")
        if day not in daily_breakdown:
            daily_breakdown[day] = {"income": 0, "expense": 0}
        if t.type == "income":
            daily_breakdown[day]["income"] += t.amount
        else:
            daily_breakdown[day]["expense"] += t.amount

    return {
        "year": year,
        "month": month,
        "summary": {
            "total_income": float(total_income),
            "total_expense": float(total_expense),
            "balance": float(total_income - total_expense),
            "transaction_count": len(results),
        },
        "top_categories": top_categories,
        "daily_breakdown": [
            {"date": day, **data} for day, data in sorted(daily_breakdown.items())
        ],
    }


def generate_yearly_report(db: Session, user_id: int, year: int) -> dict:
    """Generate yearly report.

    Args:
        db: Database session.
        user_id: User ID.
        year: Year.

    Returns:
        Yearly report data.
    """
    start_date = datetime(year, 1, 1)
    end_date = datetime(year + 1, 1, 1)

    query = (
        db.query(Transaction, Category.name.label("category_name"))
        .join(Category, Transaction.category_id == Category.id, isouter=True)
        .filter(
            Transaction.user_id == user_id,
            Transaction.date >= start_date,
            Transaction.date < end_date,
        )
    )

    results = query.all()

    # Calculate summary
    total_income = sum(t.amount for t, _ in results if t.type == "income")
    total_expense = sum(t.amount for t, _ in results if t.type == "expense")

    # Monthly breakdown
    monthly_breakdown = {}
    for t, _ in results:
        month = t.date.month
        if month not in monthly_breakdown:
            monthly_breakdown[month] = {"income": 0, "expense": 0}
        if t.type == "income":
            monthly_breakdown[month]["income"] += t.amount
        else:
            monthly_breakdown[month]["expense"] += t.amount

    # Top categories
    category_spending = {}
    for t, category_name in results:
        if t.type == "expense":
            cat_name = category_name or "Uncategorized"
            category_spending[cat_name] = category_spending.get(cat_name, 0) + t.amount

    top_categories = [
        {"category": cat, "amount": float(amount)}
        for cat, amount in sorted(category_spending.items(), key=lambda x: x[1], reverse=True)[:10]
    ]

    return {
        "year": year,
        "summary": {
            "total_income": float(total_income),
            "total_expense": float(total_expense),
            "balance": float(total_income - total_expense),
            "transaction_count": len(results),
        },
        "monthly_breakdown": [
            {"month": month, **data} for month, data in sorted(monthly_breakdown.items())
        ],
        "top_categories": top_categories,
    }
```

### 3. Update __init__.py Files
File: `app/schemas/__init__.py`
```python
from app.schemas.reports import (
    TransactionExport,
    ExportResponse,
    MonthlyReport,
    YearlyReport,
)

__all__ = [
    "TransactionExport",
    "ExportResponse",
    "MonthlyReport",
    "YearlyReport",
]
```

File: `app/crud/__init__.py`
```python
from app.crud.reports import (
    export_transactions_csv,
    export_transactions_json,
    generate_monthly_report,
    generate_yearly_report,
)

__all__ = [
    "export_transactions_csv",
    "export_transactions_json",
    "generate_monthly_report",
    "generate_yearly_report",
]
```

## Deliverables
- [ ] Reports schemas created
- [ ] CSV export function implemented
- [ ] JSON export function implemented
- [ ] Monthly report generation implemented
- [ ] Yearly report generation implemented
- [ ] All __init__.py files updated

## Next Phase
Phase 3: API Endpoints & Testing
