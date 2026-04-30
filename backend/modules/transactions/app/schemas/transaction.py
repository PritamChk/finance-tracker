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
