from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from transactions_app.crud import (
    create_transaction,
    delete_transaction,
    get_transaction,
    get_transactions_by_user,
    update_transaction,
    get_transaction_summary,
)
from transactions_app.deps import get_db
from transactions_app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
)
from transactions_app.schemas.query import TransactionQueryParams
from transactions_app.schemas.pagination import PaginatedResponse
from transactions_app.crud.transaction import (
    get_transaction,
    get_transactions_by_user,
    create_transaction,
    update_transaction,
    delete_transaction,
    get_transactions_paginated,
    get_transaction_summary,
)
from shared.deps import get_current_user_id

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("", response_model=PaginatedResponse[TransactionResponse])
async def list_transactions(
    params: TransactionQueryParams = Depends(),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """List transactions with pagination and filtering.

    Args:
        params: Query parameters for filtering and pagination.
        current_user_id: Current user ID from JWT.
        db: Database session.

    Returns:
        Paginated response with transactions.
    """
    params.user_id = current_user_id
    return get_transactions_paginated(db, params)


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction_endpoint(
    transaction: TransactionCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create a new transaction.

    Args:
        transaction: Transaction creation data.
        current_user_id: Current user ID from JWT.
        db: Database session.

    Returns:
        Created transaction.
    """
    return create_transaction(db=db, transaction=transaction, user_id=current_user_id)


@router.get("/summary", response_model=dict)
async def get_transaction_summary_endpoint(
    current_user_id: int = Depends(get_current_user_id),
    start_date: date | None = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: date | None = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    """Get transaction summary for a user.

    Args:
        current_user_id: Current user ID from JWT.
        start_date: Optional start date.
        end_date: Optional end date.
        db: Database session.

    Returns:
        Summary statistics.
    """
    return get_transaction_summary(db, current_user_id, start_date, end_date)


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction_endpoint(transaction_id: int, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Get transaction by ID.

    Args:
        transaction_id: Transaction ID.
        current_user_id: Current user ID from JWT.
        db: Database session.

    Returns:
        Transaction details.

    Raises:
        HTTPException: If transaction not found.
    """
    transaction = get_transaction(db, transaction_id=transaction_id)
    if not transaction or transaction.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction_endpoint(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update transaction.

    Args:
        transaction_id: Transaction ID.
        transaction_update: Transaction update data.
        current_user_id: Current user ID from JWT.
        db: Database session.

    Returns:
        Updated transaction.

    Raises:
        HTTPException: If transaction not found.
    """
    transaction = get_transaction(db, transaction_id=transaction_id)
    if not transaction or transaction.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    transaction = update_transaction(
        db, transaction_id=transaction_id, transaction_update=transaction_update
    )
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction_endpoint(transaction_id: int, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Delete transaction.

    Args:
        transaction_id: Transaction ID.
        current_user_id: Current user ID from JWT.
        db: Database session.

    Raises:
        HTTPException: If transaction not found.
    """
    transaction = get_transaction(db, transaction_id=transaction_id)
    if not transaction or transaction.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    success = delete_transaction(db, transaction_id=transaction_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
