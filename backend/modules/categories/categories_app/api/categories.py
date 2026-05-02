import sys
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List
import categories_app.database as database_module
from categories_app.database import get_db
from categories_app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryType,
)
from categories_app.crud.category import (
    get_category,
    get_categories_by_user,
    create_category,
    update_category,
    delete_category,
)
from categories_app.core.logger import logger
from shared.deps import get_current_user_id

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
async def list_categories(
    request: Request,
    current_user_id: int = Depends(get_current_user_id),
    category_type: CategoryType | None = Query(None, description="Filter by type"),
    db: Session = Depends(get_db),
):
    """List all categories for a user."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"LIST_CATEGORIES|user_id={current_user_id}|type={category_type}|ip={client_ip}")
    categories = get_categories_by_user(db, user_id=current_user_id, category_type=category_type)
    logger.info(f"LIST_CATEGORIES_SUCCESS|count={len(categories)}|user_id={current_user_id}")
    return categories


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category_endpoint(
    request: Request,
    category: CategoryCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create a new category."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"CREATE_CATEGORY|name={category.name}|type={category.type}|user_id={current_user_id}|ip={client_ip}")
    created = create_category(db=db, category=category, user_id=current_user_id)
    logger.info(f"CREATE_CATEGORY_SUCCESS|id={created.id}|name={created.name}")
    return created


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category_endpoint(request: Request, category_id: int, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Get category by ID."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"GET_CATEGORY|id={category_id}|ip={client_ip}")
    category = get_category(db, category_id=category_id)
    if not category or category.user_id != current_user_id:
        logger.error(f"GET_CATEGORY_FAIL|id={category_id}|reason=not_found_or_forbidden")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    logger.info(f"GET_CATEGORY_SUCCESS|id={category_id}")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category_endpoint(
    request: Request,
    category_id: int,
    category_update: CategoryUpdate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update category."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"UPDATE_CATEGORY|id={category_id}|ip={client_ip}")
    category = get_category(db, category_id=category_id)
    if not category or category.user_id != current_user_id:
        logger.error(f"UPDATE_CATEGORY_FAIL|id={category_id}|reason=not_found_or_forbidden")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    category = update_category(db, category_id=category_id, category_update=category_update)
    logger.info(f"UPDATE_CATEGORY_SUCCESS|id={category_id}")
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category_endpoint(request: Request, category_id: int, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Delete category."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"DELETE_CATEGORY|id={category_id}|ip={client_ip}")
    category = get_category(db, category_id=category_id)
    if not category or category.user_id != current_user_id:
        logger.error(f"DELETE_CATEGORY_FAIL|id={category_id}|reason=not_found_or_forbidden")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    success = delete_category(db, category_id=category_id)
    logger.info(f"DELETE_CATEGORY_SUCCESS|id={category_id}")