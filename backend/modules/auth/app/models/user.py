"""User model for authentication."""

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from shared.database import Base


class User(Base):
    """User model for authentication."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"

    @property
    def created_at_str(self) -> str:
        """Return created_at as ISO format string."""
        return self.created_at.isoformat() if self.created_at else ""
