import sys
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List
import app.database as database_module
from app.database import get_db
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
from app.core.logger import logger

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
async def list_categories(
    request: Request,
    user_id: int = Query(..., description="User ID"),
    category_type: CategoryType | None = Query(None, description="Filter by type"),
    db: Session = Depends(get_db),
):
    """List all categories for a user."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"LIST_CATEGORIES|user_id={user_id}|type={category_type}|ip={client_ip}")
    categories = get_categories_by_user(db, user_id=user_id, category_type=category_type)
    logger.info(f"LIST_CATEGORIES_SUCCESS|count={len(categories)}|user_id={user_id}")
    return categories


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category_endpoint(
    request: Request,
    category: CategoryCreate, db: Session = Depends(get_db)
):
    """Create a new category."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"CREATE_CATEGORY|name={category.name}|type={category.type}|user_id={category.user_id}|ip={client_ip}")
    created = create_category(db=db, category=category)
    logger.info(f"CREATE_CATEGORY_SUCCESS|id={created.id}|name={created.name}")
    return created


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category_endpoint(request: Request, category_id: int, db: Session = Depends(get_db)):
    """Get category by ID."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"GET_CATEGORY|id={category_id}|ip={client_ip}")
    category = get_category(db, category_id=category_id)
    if not category:
        logger.error(f"GET_CATEGORY_FAIL|id={category_id}|reason=not_found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    logger.info(f"GET_CATEGORY_SUCCESS|id={category_id}")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category_endpoint(
    request: Request,
    category_id: int, category_update: CategoryUpdate, db: Session = Depends(get_db)
):
    """Update category."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"UPDATE_CATEGORY|id={category_id}|ip={client_ip}")
    category = update_category(db, category_id=category_id, category_update=category_update)
    if not category:
        logger.error(f"UPDATE_CATEGORY_FAIL|id={category_id}|reason=not_found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    logger.info(f"UPDATE_CATEGORY_SUCCESS|id={category_id}")
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category_endpoint(request: Request, category_id: int, db: Session = Depends(get_db)):
    """Delete category."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"DELETE_CATEGORY|id={category_id}|ip={client_ip}")
    success = delete_category(db, category_id=category_id)
    if not success:
        logger.error(f"DELETE_CATEGORY_FAIL|id={category_id}|reason=not_found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    logger.info(f"DELETE_CATEGORY_SUCCESS|id={category_id}")