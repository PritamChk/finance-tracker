from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ReportQueryParams(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    category_id: Optional[int] = None
    type: Optional[str] = "all"
    format: Optional[str] = "csv"

class CategorySummaryItem(BaseModel):
    category_id: int
    category_name: str
    category_color: str
    total_income: float
    total_expense: float
    transaction_count: int

class ReportSummary(BaseModel):
    total_income: float
    total_expense: float
    net_balance: float
    transaction_count: int
    category_breakdown: List[CategorySummaryItem]

class TransactionReportItem(BaseModel):
    date: str
    category: str
    category_color: str
    type: str
    amount: float
    description: Optional[str] = None


class TransactionPreviewItem(BaseModel):
    id: int
    date: str
    type: str
    amount: float
    description: Optional[str] = None
    category_name: Optional[str] = None
