# Transactions Module - Phase 3 v1.0

## Overview
Implement advanced query capabilities: enhanced filtering, pagination, and date range queries.

## Goals
- Add comprehensive filtering options
- Implement pagination with metadata
- Add date range queries
- Add sorting options
- Add search functionality

## Prerequisites
- Phase 2 completed

## Implementation Steps

### 1. Create Query Parameters Schema
File: `app/schemas/query.py`
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal


class TransactionQueryParams(BaseModel):
    """Query parameters for transaction listing."""

    user_id: int = Field(..., description="User ID")
    transaction_type: str | None = Field(None, description="Filter by transaction type")
    category_id: int | None = Field(None, description="Filter by category ID")
    start_date: datetime | None = Field(None, description="Filter by start date")
    end_date: datetime | None = Field(None, description="Filter by end date")
    search: str | None = Field(None, description="Search in description")
    sort_by: Literal["date", "amount", "created_at"] = Field("date", description="Sort field")
    sort_order: Literal["asc", "desc"] = Field("desc", description="Sort order")
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")
```

### 2. Create Paginated Response Schema
File: `app/schemas/pagination.py`
```python
from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response schema."""

    items: List[T] = Field(..., description="List of items")
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Items per page")
    total_pages: int = Field(..., description="Total number of pages")
    has_next: bool = Field(..., description="Whether there is a next page")
    has_previous: bool = Field(..., description="Whether there is a previous page")
```

### 3. Update CRUD with Advanced Queries
File: `app/crud/transaction.py` (add to existing file)
```python
from app.schemas.query import TransactionQueryParams
from app.schemas.pagination import PaginatedResponse


def get_transactions_paginated(
    db: Session, params: TransactionQueryParams
) -> PaginatedResponse:
    """Get transactions with pagination and advanced filtering.

    Args:
        db: Database session.
        params: Query parameters.

    Returns:
        Paginated response with transactions.
    """
    query = db.query(Transaction).filter(Transaction.user_id == params.user_id)

    # Apply filters
    if params.transaction_type:
        query = query.filter(Transaction.type == params.transaction_type)
    if params.category_id:
        query = query.filter(Transaction.category_id == params.category_id)
    if params.start_date:
        query = query.filter(Transaction.date >= params.start_date)
    if params.end_date:
        query = query.filter(Transaction.date <= params.end_date)
    if params.search:
        search_term = f"%{params.search}%"
        query = query.filter(Transaction.description.ilike(search_term))

    # Get total count
    total = query.count()

    # Apply sorting
    sort_column = {
        "date": Transaction.date,
        "amount": Transaction.amount,
        "created_at": Transaction.created_at,
    }.get(params.sort_by, Transaction.date)

    if params.sort_order == "desc":
        sort_column = sort_column.desc()

    query = query.order_by(sort_column)

    # Apply pagination
    offset = (params.page - 1) * params.page_size
    items = query.offset(offset).limit(params.page_size).all()

    # Calculate pagination metadata
    total_pages = (total + params.page_size - 1) // params.page_size

    return PaginatedResponse(
        items=items,
        total=total,
        page=params.page,
        page_size=params.page_size,
        total_pages=total_pages,
        has_next=params.page < total_pages,
        has_previous=params.page > 1,
    )


def get_transaction_summary(
    db: Session,
    user_id: int,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
) -> dict:
    """Get transaction summary for a user.

    Args:
        db: Database session.
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.

    Returns:
        Dictionary with summary statistics.
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

    return {
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "balance": float(balance),
        "transaction_count": len(transactions),
    }
```

### 4. Update CRUD __init__.py
```python
from app.crud.transaction import (
    get_transaction,
    get_transactions_by_user,
    create_transaction,
    update_transaction,
    delete_transaction,
    get_transactions_paginated,
    get_transaction_summary,
)
```

## Deliverables
- [ ] Query parameters schema created
- [ ] Paginated response schema created
- [ ] Advanced query functions implemented
- [ ] Transaction summary function implemented
- [ ] CRUD module updated

## Next Phase
Phase 4: API Endpoints & Testing
