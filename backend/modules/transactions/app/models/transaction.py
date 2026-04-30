from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from shared.database import Base


class Transaction(Base):
    """Transaction model for financial transactions."""

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    category_id = Column(Integer, nullable=True)
    type = Column(String(20), nullable=False)  # 'income' or 'expense'
    amount = Column(Float, nullable=False)
    description = Column(String(500), nullable=True)
    date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Transaction(id={self.id}, type={self.type}, amount={self.amount})>"
