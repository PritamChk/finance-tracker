from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from transactions_app.models.transaction import Transaction
from transactions_app.schemas.transaction import TransactionCreate, TransactionUpdate
from transactions_app.schemas.query import TransactionQueryParams
from transactions_app.schemas.pagination import PaginatedResponse


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


def create_transaction(db: Session, transaction: TransactionCreate, user_id: int) -> Transaction:
    """Create a new transaction.

    Args:
        db: Database session.
        transaction: Transaction creation data.
        user_id: User ID from JWT.

    Returns:
        Created transaction.
    """
    db_transaction = Transaction(**transaction.model_dump(), user_id=user_id)
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
    start_date: date | None = None,
    end_date: date | None = None,
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
    net = total_income - total_expense

    return {
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "net": float(net),
        "count": len(transactions),
    }

