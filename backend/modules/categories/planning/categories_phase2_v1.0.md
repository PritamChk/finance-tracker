# Categories Module - Phase 2 v1.0

## Overview
Define database models, Pydantic schemas, and CRUD operations for category management.

## Goals
- Create Category database model
- Create Pydantic schemas for category operations
- Implement CRUD operations

## Prerequisites
- Phase 1 completed
- Auth module completed (for user_id foreign key)

## Implementation Steps

### 1. Create Category Model
File: `app/models/category.py`
```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from shared.database import Base


class Category(Base):
    """Category model for transaction categorization."""

    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(20), nullable=False)  # 'income' or 'expense'
    color = Column(String(7), nullable=False)  # Hex color code
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Category(id={self.id}, name={self.name}, type={self.type})>"
```

### 2. Create Category Schemas
File: `app/schemas/category.py`
```python
from pydantic import BaseModel, Field
from typing import Literal, Optional


CategoryType = Literal["income", "expense"]


class CategoryBase(BaseModel):
    """Base category schema."""

    name: str = Field(..., min_length=1, max_length=100, description="Category name")
    type: CategoryType = Field(..., description="Category type")
    color: str = Field(..., pattern=r"^#[0-9A-Fa-f]{6}$", description="Hex color code")


class CategoryCreate(CategoryBase):
    """Schema for category creation."""

    user_id: int = Field(..., description="User ID")


class CategoryUpdate(BaseModel):
    """Schema for category update."""

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[CategoryType] = None
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")


class CategoryResponse(CategoryBase):
    """Schema for category response."""

    id: int = Field(..., description="Category ID")
    user_id: int = Field(..., description="User ID")
    created_at: str = Field(..., description="Category creation timestamp")

    class Config:
        from_attributes = True
```

### 3. Create CRUD Operations
File: `app/crud/category.py`
```python
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryType


def get_category(db: Session, category_id: int) -> Optional[Category]:
    """Get category by ID.

    Args:
        db: Database session.
        category_id: Category ID.

    Returns:
        Category or None.
    """
    return db.query(Category).filter(Category.id == category_id).first()


def get_categories_by_user(
    db: Session, user_id: int, category_type: Optional[CategoryType] = None
) -> List[Category]:
    """Get all categories for a user.

    Args:
        db: Database session.
        user_id: User ID.
        category_type: Optional category type filter.

    Returns:
        List of categories.
    """
    query = db.query(Category).filter(Category.user_id == user_id)
    if category_type:
        query = query.filter(Category.type == category_type)
    return query.order_by(Category.name).all()


def create_category(db: Session, category: CategoryCreate) -> Category:
    """Create a new category.

    Args:
        db: Database session.
        category: Category creation data.

    Returns:
        Created category.
    """
    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def update_category(
    db: Session, category_id: int, category_update: CategoryUpdate
) -> Optional[Category]:
    """Update a category.

    Args:
        db: Database session.
        category_id: Category ID.
        category_update: Category update data.

    Returns:
        Updated category or None.
    """
    db_category = get_category(db, category_id)
    if not db_category:
        return None

    update_data = category_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_category, field, value)

    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int) -> bool:
    """Delete a category.

    Args:
        db: Database session.
        category_id: Category ID.

    Returns:
        True if deleted, False if not found.
    """
    db_category = get_category(db, category_id)
    if not db_category:
        return False

    db.delete(db_category)
    db.commit()
    return True
```

### 4. Update __init__.py Files
File: `app/models/__init__.py`
```python
from app.models.category import Category

__all__ = ["Category"]
```

File: `app/schemas/__init__.py`
```python
from app.schemas.category import (
    CategoryBase,
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryType,
)

__all__ = ["CategoryBase", "CategoryCreate", "CategoryUpdate", "CategoryResponse", "CategoryType"]
```

File: `app/crud/__init__.py`
```python
from app.crud.category import (
    get_category,
    get_categories_by_user,
    create_category,
    update_category,
    delete_category,
)

__all__ = [
    "get_category",
    "get_categories_by_user",
    "create_category",
    "update_category",
    "delete_category",
]
```

### 5. Update main.py for Database Initialization
```python
from shared.database import init_db
from app.models.category import Category

@app.on_event("startup")
async def startup_event():
    init_db()
```

## Deliverables
- [ ] Category model created
- [ ] Category schemas created
- [ ] CRUD operations implemented
- [ ] All __init__.py files updated
- [ ] Database initialization added to main.py

## Next Phase
Phase 3: API Endpoints & Testing
