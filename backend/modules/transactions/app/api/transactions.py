from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
from shared.database import get_db
from app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionType,
)
from app.schemas.query import TransactionQueryParams
from app.schemas.pagination import PaginatedResponse
from app.crud.transaction import (
    get_transaction,
    get_transactions_by_user,
    create_transaction,
    update_transaction,
    delete_transaction,
    get_transactions_paginated,
    get_transaction_summary,
)

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("", response_model=PaginatedResponse[TransactionResponse])
async def list_transactions(params: TransactionQueryParams = Depends(), db: Session = Depends(get_db)):
    """List transactions with pagination and filtering.

    Args:
        params: Query parameters for filtering and pagination.
        db: Database session.

    Returns:
        Paginated response with transactions.
    """
    return get_transactions_paginated(db, params)


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction_endpoint(transaction: TransactionCreate, db: Session = Depends(get_db)):
    """Create a new transaction.

    Args:
        transaction: Transaction creation data.
        db: Database session.

    Returns:
        Created transaction.
    """
    return create_transaction(db=db, transaction=transaction)


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction_endpoint(transaction_id: int, db: Session = Depends(get_db)):
    """Get transaction by ID.

    Args:
        transaction_id: Transaction ID.
        db: Database session.

    Returns:
        Transaction details.

    Raises:
        HTTPException: If transaction not found.
    """
    transaction = get_transaction(db, transaction_id=transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction_endpoint(
    transaction_id: int, transaction_update: TransactionUpdate, db: Session = Depends(get_db)
):
    """Update transaction.

    Args:
        transaction_id: Transaction ID.
        transaction_update: Transaction update data.
        db: Database session.

    Returns:
        Updated transaction.

    Raises:
        HTTPException: If transaction not found.
    """
    transaction = update_transaction(
        db, transaction_id=transaction_id, transaction_update=transaction_update
    )
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction_endpoint(transaction_id: int, db: Session = Depends(get_db)):
    """Delete transaction.

    Args:
        transaction_id: Transaction ID.
        db: Database session.

    Raises:
        HTTPException: If transaction not found.
    """
    success = delete_transaction(db, transaction_id=transaction_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )


@router.get("/summary", response_model=dict)
async def get_transaction_summary_endpoint(
    user_id: int = Query(..., description="User ID"),
    start_date: datetime | None = Query(None, description="Start date"),
    end_date: datetime | None = Query(None, description="End date"),
    db: Session = Depends(get_db),
):
    """Get transaction summary for a user.

    Args:
        user_id: User ID.
        start_date: Optional start date.
        end_date: Optional end date.
        db: Database session.

    Returns:
        Summary statistics.
    """
    return get_transaction_summary(db, user_id, start_date, end_date)
