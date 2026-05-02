from pydantic import BaseModel, Field, ConfigDict
from typing import Literal, Optional
from datetime import datetime


CategoryType = Literal["income", "expense"]


class CategoryBase(BaseModel):
    """Base category schema."""

    name: str = Field(..., min_length=1, max_length=100, description="Category name")
    type: CategoryType = Field(..., description="Category type")
    color: str = Field(..., pattern=r"^#[0-9A-Fa-f]{6}$", description="Hex color code")


class CategoryCreate(CategoryBase):
    """Schema for category creation."""


class CategoryUpdate(BaseModel):
    """Schema for category update."""

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[CategoryType] = None
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")


class CategoryResponse(CategoryBase):
    """Schema for category response."""

    id: int = Field(..., description="Category ID")
    user_id: int = Field(..., description="User ID")
    created_at: datetime = Field(..., description="Category creation timestamp")

    model_config = ConfigDict(from_attributes=True)