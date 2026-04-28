# Transactions Module - Phase 2 v1.0

## Overview
Define database models, Pydantic schemas, and CRUD operations for transaction management.

## Goals
- Create Transaction database model
- Create Pydantic schemas for transaction operations
- Implement basic CRUD operations

## Prerequisites
- Phase 1 completed
- Auth module completed (for user_id foreign key)
- Categories module completed (for category_id foreign key)

## Implementation Steps

### 1. Create Transaction Model
File: `app/models/transaction.py`
```python
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from shared.database import Base


class Transaction(Base):
    """Transaction model for financial transactions."""

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    type = Column(String(20), nullable=False)  # 'income' or 'expense'
    amount = Column(Float, nullable=False)
    description = Column(String(500), nullable=True)
    date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Transaction(id={self.id}, type={self.type}, amount={self.amount})>"
```

### 2. Create Transaction Schemas
File: `app/schemas/transaction.py`
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal, Optional


TransactionType = Literal["income", "expense"]


class TransactionBase(BaseModel):
    """Base transaction schema."""

    type: TransactionType = Field(..., description="Transaction type")
    amount: float = Field(..., gt=0, description="Transaction amount")
    description: Optional[str] = Field(None, max_length=500, description="Transaction description")
    date: datetime = Field(..., description="Transaction date")


class TransactionCreate(TransactionBase):
    """Schema for transaction creation."""

    user_id: int = Field(..., description="User ID")
    category_id: Optional[int] = Field(None, description="Category ID")


class TransactionUpdate(BaseModel):
    """Schema for transaction update."""

    type: Optional[TransactionType] = None
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = Field(None, max_length=500)
    date: Optional[datetime] = None
    category_id: Optional[int] = None


class TransactionResponse(TransactionBase):
    """Schema for transaction response."""

    id: int = Field(..., description="Transaction ID")
    user_id: int = Field(..., description="User ID")
    category_id: Optional[int] = Field(None, description="Category ID")
    created_at: str = Field(..., description="Transaction creation timestamp")

    class Config:
        from_attributes = True
```

### 3. Create CRUD Operations
File: `app/crud/transaction.py`
```python
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate


def get_transaction(db: Session, transaction_id: int) -> Optional[Transaction]:
    """Get transaction by ID.

    Args:
        db: Database session.
        transaction_id: Transaction ID.

    Returns:
        Transaction or None.
    """
    return db.query(Transaction).filter(Transaction.id == transaction_id).first()


def get_transactions_by_user(db: Session, user_id: int) -> List[Transaction]:
    """Get all transactions for a user.

    Args:
        db: Database session.
        user_id: User ID.

    Returns:
        List of transactions.
    """
    return db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.date.desc()).all()


def create_transaction(db: Session, transaction: TransactionCreate) -> Transaction:
    """Create a new transaction.

    Args:
        db: Database session.
        transaction: Transaction creation data.

    Returns:
        Created transaction.
    """
    db_transaction = Transaction(**transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def update_transaction(
    db: Session, transaction_id: int, transaction_update: TransactionUpdate
) -> Optional[Transaction]:
    """Update a transaction.

    Args:
        db: Database session.
        transaction_id: Transaction ID.
        transaction_update: Transaction update data.

    Returns:
        Updated transaction or None.
    """
    db_transaction = get_transaction(db, transaction_id)
    if not db_transaction:
        return None

    update_data = transaction_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_transaction, field, value)

    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def delete_transaction(db: Session, transaction_id: int) -> bool:
    """Delete a transaction.

    Args:
        db: Database session.
        transaction_id: Transaction ID.

    Returns:
        True if deleted, False if not found.
    """
    db_transaction = get_transaction(db, transaction_id)
    if not db_transaction:
        return False

    db.delete(db_transaction)
    db.commit()
    return True
```

### 4. Update __init__.py Files
File: `app/models/__init__.py`
```python
from app.models.transaction import Transaction

__all__ = ["Transaction"]
```

File: `app/schemas/__init__.py`
```python
from app.schemas.transaction import (
    TransactionBase,
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionType,
)

__all__ = [
    "TransactionBase",
    "TransactionCreate",
    "TransactionUpdate",
    "TransactionResponse",
    "TransactionType",
]
```

File: `app/crud/__init__.py`
```python
from app.crud.transaction import (
    get_transaction,
    get_transactions_by_user,
    create_transaction,
    update_transaction,
    delete_transaction,
)

__all__ = [
    "get_transaction",
    "get_transactions_by_user",
    "create_transaction",
    "update_transaction",
    "delete_transaction",
]
```

### 5. Update main.py for Database Initialization
```python
from shared.database import init_db
from app.models.transaction import Transaction

@app.on_event("startup")
async def startup_event():
    init_db()
```

## Deliverables
- [ ] Transaction model created
- [ ] Transaction schemas created
- [ ] CRUD operations implemented
- [ ] All __init__.py files updated
- [ ] Database initialization added to main.py

## Next Phase
Phase 3: Advanced Queries
