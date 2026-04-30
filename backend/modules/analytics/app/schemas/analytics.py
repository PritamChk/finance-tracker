from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class CategorySpending(BaseModel):
    """Schema for category spending."""
    category_id: Optional[int] = Field(None, description="Category ID")
    category_name: str = Field(..., description="Category name")
    amount: float = Field(..., description="Total amount spent")
    percentage: float = Field(..., description="Percentage of total spending")

class MonthlyData(BaseModel):
    """Schema for monthly data."""
    month: str = Field(..., description="Month label (YYYY-MM)")
    income: float = Field(..., description="Total income")
    expense: float = Field(..., description="Total expense")
    balance: float = Field(..., description="Net balance")

class IncomeExpenseComparison(BaseModel):
    """Schema for income vs expense comparison."""
    income: float = Field(..., description="Total income")
    expense: float = Field(..., description="Total expense")
    balance: float = Field(..., description="Net balance")
    savings_rate: float = Field(..., description="Savings rate as percentage")

class FinancialSummary(BaseModel):
    """Schema for financial summary."""
    total_income: float = Field(..., description="Total income")
    total_expense: float = Field(..., description="Total expense")
    balance: float = Field(..., description="Net balance")
    transaction_count: int = Field(..., description="Total transactions")
    average_expense: float = Field(..., description="Average expense per transaction")
    top_spending_category: Optional[str] = Field(None, description="Top spending category")
