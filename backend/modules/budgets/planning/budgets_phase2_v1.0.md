# Budgets Module - Phase 2 v1.0

## Overview
Define database models, Pydantic schemas, and CRUD operations for budget management.

## Goals
- Create Budget database model
- Create Pydantic schemas for budget operations
- Implement CRUD operations
- Implement budget progress calculation

## Prerequisites
- Phase 1 completed
- Auth module completed (for user_id foreign key)
- Categories module completed (for category_id foreign key)

## Implementation Steps

### 1. Create Budget Model
File: `app/models/budget.py`
```python
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from shared.database import Base


class Budget(Base):
    """Budget model for spending limits."""

    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    category_id = Column(Integer, nullable=True)
    name = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    period = Column(String(20), nullable=False)  # 'monthly', 'weekly', 'yearly'
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Budget(id={self.id}, name={self.name}, amount={self.amount})>"
```

### 2. Create Budget Schemas
File: `app/schemas/budget.py`
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal, Optional


BudgetPeriod = Literal["monthly", "weekly", "yearly"]


class BudgetBase(BaseModel):
    """Base budget schema."""

    name: str = Field(..., min_length=1, max_length=100, description="Budget name")
    amount: float = Field(..., gt=0, description="Budget amount")
    period: BudgetPeriod = Field(..., description="Budget period")
    start_date: datetime = Field(..., description="Budget start date")
    end_date: Optional[datetime] = Field(None, description="Budget end date")


class BudgetCreate(BudgetBase):
    """Schema for budget creation."""

    user_id: int = Field(..., description="User ID")
    category_id: Optional[int] = Field(None, description="Category ID")


class BudgetUpdate(BaseModel):
    """Schema for budget update."""

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    amount: Optional[float] = Field(None, gt=0)
    period: Optional[BudgetPeriod] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    category_id: Optional[int] = None


class BudgetResponse(BudgetBase):
    """Schema for budget response."""

    id: int = Field(..., description="Budget ID")
    user_id: int = Field(..., description="User ID")
    category_id: Optional[int] = Field(None, description="Category ID")
    created_at: str = Field(..., description="Budget creation timestamp")

    class Config:
        from_attributes = True


class BudgetProgress(BaseModel):
    """Schema for budget progress."""

    budget_id: int = Field(..., description="Budget ID")
    budget_name: str = Field(..., description="Budget name")
    budget_amount: float = Field(..., description="Budget amount")
    spent: float = Field(..., description="Amount spent")
    remaining: float = Field(..., description="Amount remaining")
    percentage: float = Field(..., description="Percentage spent")
    is_over_budget: bool = Field(..., description="Whether over budget")
```

### 3. Create CRUD Operations
File: `app/crud/budget.py`
```python
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetProgress


def get_budget(db: Session, budget_id: int) -> Optional[Budget]:
    """Get budget by ID.

    Args:
        db: Database session.
        budget_id: Budget ID.

    Returns:
        Budget or None.
    """
    return db.query(Budget).filter(Budget.id == budget_id).first()


def get_budgets_by_user(db: Session, user_id: int) -> List[Budget]:
    """Get all budgets for a user.

    Args:
        db: Database session.
        user_id: User ID.

    Returns:
        List of budgets.
    """
    return db.query(Budget).filter(Budget.user_id == user_id).order_by(Budget.name).all()


def create_budget(db: Session, budget: BudgetCreate) -> Budget:
    """Create a new budget.

    Args:
        db: Database session.
        budget: Budget creation data.

    Returns:
        Created budget.
    """
    db_budget = Budget(**budget.model_dump())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget


def update_budget(
    db: Session, budget_id: int, budget_update: BudgetUpdate
) -> Optional[Budget]:
    """Update a budget.

    Args:
        db: Database session.
        budget_id: Budget ID.
        budget_update: Budget update data.

    Returns:
        Updated budget or None.
    """
    db_budget = get_budget(db, budget_id)
    if not db_budget:
        return None

    update_data = budget_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_budget, field, value)

    db.commit()
    db.refresh(db_budget)
    return db_budget


def delete_budget(db: Session, budget_id: int) -> bool:
    """Delete a budget.

    Args:
        db: Database session.
        budget_id: Budget ID.

    Returns:
        True if deleted, False if not found.
    """
    db_budget = get_budget(db, budget_id)
    if not db_budget:
        return False

    db.delete(db_budget)
    db.commit()
    return True


def calculate_budget_progress(db: Session, budget_id: int) -> Optional[BudgetProgress]:
    """Calculate budget progress.

    Args:
        db: Database session.
        budget_id: Budget ID.

    Returns:
        Budget progress or None.
    """
    budget = get_budget(db, budget_id)
    if not budget:
        return None

    # Get transactions within budget period
    query = db.query(Transaction).filter(
        Transaction.user_id == budget.user_id,
        Transaction.type == "expense",
        Transaction.date >= budget.start_date,
    )

    if budget.end_date:
        query = query.filter(Transaction.date <= budget.end_date)

    if budget.category_id:
        query = query.filter(Transaction.category_id == budget.category_id)

    transactions = query.all()
    spent = sum(t.amount for t in transactions)
    remaining = budget.amount - spent
    percentage = (spent / budget.amount * 100) if budget.amount > 0 else 0

    return BudgetProgress(
        budget_id=budget.id,
        budget_name=budget.name,
        budget_amount=budget.amount,
        spent=spent,
        remaining=remaining,
        percentage=percentage,
        is_over_budget=spent > budget.amount,
    )
```

### 4. Update __init__.py Files
File: `app/models/__init__.py`
```python
from app.models.budget import Budget

__all__ = ["Budget"]
```

File: `app/schemas/__init__.py`
```python
from app.schemas.budget import (
    BudgetBase,
    BudgetCreate,
    BudgetUpdate,
    BudgetResponse,
    BudgetProgress,
    BudgetPeriod,
)

__all__ = [
    "BudgetBase",
    "BudgetCreate",
    "BudgetUpdate",
    "BudgetResponse",
    "BudgetProgress",
    "BudgetPeriod",
]
```

File: `app/crud/__init__.py`
```python
from app.crud.budget import (
    get_budget,
    get_budgets_by_user,
    create_budget,
    update_budget,
    delete_budget,
    calculate_budget_progress,
)

__all__ = [
    "get_budget",
    "get_budgets_by_user",
    "create_budget",
    "update_budget",
    "delete_budget",
    "calculate_budget_progress",
]
```

### 5. Update main.py for Database Initialization
```python
from shared.database import init_db
from app.models.budget import Budget

@app.on_event("startup")
async def startup_event():
    init_db()
```

## Deliverables
- [ ] Budget model created
- [ ] Budget schemas created
- [ ] CRUD operations implemented
- [ ] Budget progress calculation implemented
- [ ] All __init__.py files updated
- [ ] Database initialization added to main.py

## Next Phase
Phase 3: API Endpoints & Testing
