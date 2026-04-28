# Categories Module - Phase 3 v1.0

## Overview
Create API endpoints for category management and write tests.

## Goals
- Create list categories endpoint
- Create create category endpoint
- Create get category endpoint
- Create update category endpoint
- Create delete category endpoint
- Write comprehensive tests

## Prerequisites
- Phase 2 completed

## Implementation Steps

### 1. Create Categories Endpoints
File: `app/api/categories.py`
```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from shared.database import get_db
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryType,
)
from app.crud.category import (
    get_category,
    get_categories_by_user,
    create_category,
    update_category,
    delete_category,
)

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
async def list_categories(
    user_id: int = Query(..., description="User ID"),
    category_type: CategoryType | None = Query(None, description="Filter by type"),
    db: Session = Depends(get_db),
):
    """List all categories for a user.

    Args:
        user_id: User ID.
        category_type: Optional category type filter.
        db: Database session.

    Returns:
        List of categories.
    """
    return get_categories_by_user(db, user_id=user_id, category_type=category_type)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category_endpoint(
    category: CategoryCreate, db: Session = Depends(get_db)
):
    """Create a new category.

    Args:
        category: Category creation data.
        db: Database session.

    Returns:
        Created category.
    """
    return create_category(db=db, category=category)


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category_endpoint(category_id: int, db: Session = Depends(get_db)):
    """Get category by ID.

    Args:
        category_id: Category ID.
        db: Database session.

    Returns:
        Category details.

    Raises:
        HTTPException: If category not found.
    """
    category = get_category(db, category_id=category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category_endpoint(
    category_id: int, category_update: CategoryUpdate, db: Session = Depends(get_db)
):
    """Update category.

    Args:
        category_id: Category ID.
        category_update: Category update data.
        db: Database session.

    Returns:
        Updated category.

    Raises:
        HTTPException: If category not found.
    """
    category = update_category(db, category_id=category_id, category_update=category_update)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category_endpoint(category_id: int, db: Session = Depends(get_db)):
    """Delete category.

    Args:
        category_id: Category ID.
        db: Database session.

    Raises:
        HTTPException: If category not found.
    """
    success = delete_category(db, category_id=category_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
```

### 2. Register Router in main.py
```python
from app.api.categories import router as categories_router

app.include_router(categories_router)
```

### 3. Write Tests
File: `tests/test_categories.py`
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_category():
    """Test category creation."""
    response = client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Food",
            "type": "expense",
            "color": "#ef4444"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Food"
    assert data["type"] == "expense"
    assert data["color"] == "#ef4444"
    assert "id" in data


def test_list_categories():
    """Test listing categories."""
    # Create a category first
    client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Transport",
            "type": "expense",
            "color": "#3b82f6"
        }
    )

    # List categories
    response = client.get("/api/categories?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(cat["name"] == "Transport" for cat in data)


def test_list_categories_by_type():
    """Test listing categories filtered by type."""
    # Create categories
    client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Salary",
            "type": "income",
            "color": "#22c55e"
        }
    )
    client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Rent",
            "type": "expense",
            "color": "#ef4444"
        }
    )

    # List income categories
    response = client.get("/api/categories?user_id=1&category_type=income")
    assert response.status_code == 200
    data = response.json()
    assert all(cat["type"] == "income" for cat in data)


def test_get_category():
    """Test getting a category by ID."""
    # Create a category
    create_response = client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Utilities",
            "type": "expense",
            "color": "#f59e0b"
        }
    )
    category_id = create_response.json()["id"]

    # Get the category
    response = client.get(f"/api/categories/{category_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == category_id
    assert data["name"] == "Utilities"


def test_get_category_not_found():
    """Test getting a non-existent category."""
    response = client.get("/api/categories/99999")
    assert response.status_code == 404


def test_update_category():
    """Test updating a category."""
    # Create a category
    create_response = client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "Entertainment",
            "type": "expense",
            "color": "#8b5cf6"
        }
    )
    category_id = create_response.json()["id"]

    # Update the category
    response = client.put(
        f"/api/categories/{category_id}",
        json={"name": "Movies", "color": "#ec4899"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Movies"
    assert data["color"] == "#ec4899"


def test_delete_category():
    """Test deleting a category."""
    # Create a category
    create_response = client.post(
        "/api/categories",
        json={
            "user_id": 1,
            "name": "To Delete",
            "type": "expense",
            "color": "#6b7280"
        }
    )
    category_id = create_response.json()["id"]

    # Delete the category
    response = client.delete(f"/api/categories/{category_id}")
    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get(f"/api/categories/{category_id}")
    assert get_response.status_code == 404
```

### 4. Run Tests
```bash
uv run pytest tests/ -v
```

## Deliverables
- [ ] List categories endpoint created
- [ ] Create category endpoint created
- [ ] Get category endpoint created
- [ ] Update category endpoint created
- [ ] Delete category endpoint created
- [ ] All tests passing
- [ ] Swagger UI shows all endpoints

## Verification

### Manual Testing
1. Start server: `./run.sh`
2. Visit http://localhost:8002/docs
3. Test all endpoints via Swagger UI

### API Endpoints
- `GET /api/categories` - List categories (with optional type filter)
- `POST /api/categories` - Create category
- `GET /api/categories/{id}` - Get category details
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

## Module Complete
Categories module is now complete and ready for integration with other modules.
