# Analytics Module - Phase 2 v1.0

## Overview
Implement analytics query functions for financial insights.

## Goals
- Implement summary query
- Implement spending by category query
- Implement monthly trend query
- Implement income vs expense query

## Prerequisites
- Phase 1 completed
- Transactions module completed (for transaction data)

## Implementation Steps

### 1. Create Analytics Schemas
File: `app/schemas/analytics.py`
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class CategorySpending(BaseModel):
    """Schema for category spending."""

    category_id: Optional[int] = Field(None, description="Category ID")
    category_name: str = Field(..., description="Category name")
    amount: float = Field(..., description="Total amount spent")
    percentage: float = Field(..., description="Percentage of total spending")


class MonthlyData(BaseModel):
    """Schema for monthly data."""

    month: str = Field(..., description="Month label (YYYY-MM)")
    income: float = Field(..., description="Total income")
    expense: float = Field(..., description="Total expense")
    balance: float = Field(..., description="Net balance")


class IncomeExpenseComparison(BaseModel):
    """Schema for income vs expense comparison."""

    income: float = Field(..., description="Total income")
    expense: float = Field(..., description="Total expense")
    balance: float = Field(..., description="Net balance")
    savings_rate: float = Field(..., description="Savings rate as percentage")


class FinancialSummary(BaseModel):
    """Schema for financial summary."""

    total_income: float = Field(..., description="Total income")
    total_expense: float = Field(..., description="Total expense")
    balance: float = Field(..., description="Net balance")
    transaction_count: int = Field(..., description="Total transactions")
    average_expense: float = Field(..., description="Average expense per transaction")
    top_spending_category: Optional[str] = Field(None, description="Top spending category")
```

### 2. Create Analytics CRUD Functions
File: `app/crud/analytics.py`
```python
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Optional
from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.analytics import (
    CategorySpending,
    MonthlyData,
    IncomeExpenseComparison,
    FinancialSummary,
)


def get_summary(
    db: Session,
    user_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> FinancialSummary:
    """Get financial summary.

    Args:
        db: Database session.
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.

    Returns:
        Financial summary.
    """
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.all()

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = total_income - total_expense

    expense_transactions = [t for t in transactions if t.type == "expense"]
    average_expense = sum(t.amount for t in expense_transactions) / len(expense_transactions) if expense_transactions else 0

    # Find top spending category
    category_spending = {}
    for t in expense_transactions:
        if t.category_id:
            category_spending[t.category_id] = category_spending.get(t.category_id, 0) + t.amount

    top_category_id = max(category_spending, key=category_spending.get) if category_spending else None
    top_category = None
    if top_category_id:
        category = db.query(Category).filter(Category.id == top_category_id).first()
        top_category = category.name if category else None

    return FinancialSummary(
        total_income=float(total_income),
        total_expense=float(total_expense),
        balance=float(balance),
        transaction_count=len(transactions),
        average_expense=float(average_expense),
        top_spending_category=top_category,
    )


def get_spending_by_category(
    db: Session,
    user_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> List[CategorySpending]:
    """Get spending breakdown by category.

    Args:
        db: Database session.
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.

    Returns:
        List of category spending.
    """
    query = (
        db.query(
            Transaction.category_id,
            Category.name.label("category_name"),
            func.sum(Transaction.amount).label("total"),
        )
        .join(Category, Transaction.category_id == Category.id, isouter=True)
        .filter(Transaction.user_id == user_id, Transaction.type == "expense")
    )

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    results = query.group_by(Transaction.category_id, Category.name).all()

    total_spending = sum(r.total for r in results)

    return [
        CategorySpending(
            category_id=r.category_id,
            category_name=r.category_name or "Uncategorized",
            amount=float(r.total),
            percentage=float(r.total / total_spending * 100) if total_spending > 0 else 0,
        )
        for r in results
    ]


def get_monthly_trend(db: Session, user_id: int, months: int = 12) -> List[MonthlyData]:
    """Get monthly spending trend.

    Args:
        db: Database session.
        user_id: User ID.
        months: Number of months to include.

    Returns:
        List of monthly data.
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=months * 30)

    results = (
        db.query(
            func.strftime("%Y-%m", Transaction.date).label("month"),
            func.sum(
                func.case((Transaction.type == "income", Transaction.amount), else_=0)
            ).label("income"),
            func.sum(
                func.case((Transaction.type == "expense", Transaction.amount), else_=0)
            ).label("expense"),
        )
        .filter(Transaction.user_id == user_id, Transaction.date >= start_date)
        .group_by(func.strftime("%Y-%m", Transaction.date))
        .order_by(func.strftime("%Y-%m", Transaction.date))
        .all()
    )

    return [
        MonthlyData(
            month=r.month,
            income=float(r.income),
            expense=float(r.expense),
            balance=float(r.income - r.expense),
        )
        for r in results
    ]


def get_income_vs_expense(
    db: Session,
    user_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> IncomeExpenseComparison:
    """Get income vs expense comparison.

    Args:
        db: Database session.
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.

    Returns:
        Income vs expense comparison.
    """
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.all()

    income = sum(t.amount for t in transactions if t.type == "income")
    expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = income - expense
    savings_rate = (balance / income * 100) if income > 0 else 0

    return IncomeExpenseComparison(
        income=float(income),
        expense=float(expense),
        balance=float(balance),
        savings_rate=float(savings_rate),
    )
```

### 3. Update __init__.py Files
File: `app/schemas/__init__.py`
```python
from app.schemas.analytics import (
    CategorySpending,
    MonthlyData,
    IncomeExpenseComparison,
    FinancialSummary,
)

__all__ = [
    "CategorySpending",
    "MonthlyData",
    "IncomeExpenseComparison",
    "FinancialSummary",
]
```

File: `app/crud/__init__.py`
```python
from app.crud.analytics import (
    get_summary,
    get_spending_by_category,
    get_monthly_trend,
    get_income_vs_expense,
)

__all__ = [
    "get_summary",
    "get_spending_by_category",
    "get_monthly_trend",
    "get_income_vs_expense",
]
```

## Deliverables
- [ ] Analytics schemas created
- [ ] Summary query implemented
- [ ] Spending by category query implemented
- [ ] Monthly trend query implemented
- [ ] Income vs expense query implemented
- [ ] All __init__.py files updated

## Next Phase
Phase 3: API Endpoints & Testing
