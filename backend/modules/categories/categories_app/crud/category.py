import sys
from pathlib import Path

backend_root = Path(__file__).parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from sqlalchemy.orm import Session
from typing import List, Optional
from categories_app.models.category import Category
from categories_app.schemas.category import CategoryCreate, CategoryUpdate, CategoryType


def get_category(db: Session, category_id: int) -> Optional[Category]:
    """Get category by ID."""
    return db.query(Category).filter(Category.id == category_id).first()


def get_categories_by_user(
    db: Session, user_id: int, category_type: Optional[CategoryType] = None
) -> List[Category]:
    """Get all categories for a user."""
    query = db.query(Category).filter(Category.user_id == user_id)
    if category_type:
        query = query.filter(Category.type == category_type)
    return query.order_by(Category.name).all()


def create_category(db: Session, category: CategoryCreate, user_id: int) -> Category:
    """Create a new category."""
    db_category = Category(**category.model_dump(), user_id=user_id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def update_category(
    db: Session, category_id: int, category_update: CategoryUpdate
) -> Optional[Category]:
    """Update a category."""
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
    """Delete a category."""
    db_category = get_category(db, category_id)
    if not db_category:
        return False

    db.delete(db_category)
    db.commit()
    return True