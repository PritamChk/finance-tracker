from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal


class TransactionQueryParams(BaseModel):
    """Query parameters for transaction listing."""

    user_id: int | None = Field(None, description="User ID (set from JWT)")
    transaction_type: str | None = Field(None, description="Filter by transaction type")
    category_id: int | None = Field(None, description="Filter by category ID")
    start_date: datetime | None = Field(None, description="Filter by start date")
    end_date: datetime | None = Field(None, description="Filter by end date")
    search: str | None = Field(None, description="Search in description")
    sort_by: Literal["date", "amount", "created_at"] = Field("date", description="Sort field")
    sort_order: Literal["asc", "desc"] = Field("desc", description="Sort order")
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")
