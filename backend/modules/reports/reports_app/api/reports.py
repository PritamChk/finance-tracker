from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import io

from shared.deps import get_current_user_id
from shared.database import get_db
from shared.models.user import User

from reports_app.crud.reports import (
    get_transactions_for_report,
    get_transactions_for_preview,
    get_category_summary,
    generate_csv_report,
    generate_pdf_report
)
from reports_app.core.logger import logger
from reports_app.schemas.reports import TransactionPreviewItem

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/preview")
async def preview_transactions(
    request: Request,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    type: str = Query("all", enum=["all", "income", "expense"]),
    page: int = Query(1),
    page_size: int = Query(7),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get transaction preview (JSON) for report page."""
    client_ip = request.client.host if request.client else "unknown"

    logger.info(f"PREVIEW_TRANSACTIONS|user_id={current_user_id}|start={start_date}|end={end_date}|ip={client_ip}")

    transactions, total_count = get_transactions_for_preview(
        db, current_user_id, start_date, end_date, category_id, type, page_size
    )

    items = []
    for txn in transactions:
        items.append(TransactionPreviewItem(
            id=txn.id,
            date=txn.date.isoformat() if txn.date else "",
            type=txn.type,
            amount=txn.amount,
            description=txn.description,
            category_name=txn.category.name if txn.category else None
        ))

    logger.info(f"PREVIEW_TRANSACTIONS_SUCCESS|user_id={current_user_id}|count={len(items)}|total={total_count}")

    return {
        "items": items,
        "total": total_count,
        "page": page,
        "page_size": page_size
    }


@router.get("/transactions")
async def export_transactions(
    request: Request,
    format: str = Query("csv", enum=["csv", "pdf"]),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    type: str = Query("all", enum=["all", "income", "expense"]),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Export transactions report (CSV or PDF)."""
    client_ip = request.client.host if request.client else "unknown"

    logger.info(f"EXPORT_TRANSACTIONS|user_id={current_user_id}|format={format}|start={start_date}|end={end_date}|category={category_id}|type={type}|ip={client_ip}")

    user = db.query(User).filter(User.id == current_user_id).first()
    user_name = user.full_name or user.email if user else "Unknown"

    transactions = get_transactions_for_report(
        db, current_user_id, start_date, end_date, category_id, type
    )

    category_summary = get_category_summary(db, current_user_id, start_date, end_date)

    filename = f"report_{start_date or 'start'}_to_{end_date or 'end'}.{format}"

    if format == "csv":
        logger.info(f"EXPORT_CSV|user_id={current_user_id}|count={len(transactions)}")
        csv_content = generate_csv_report(transactions, category_summary, start_date, end_date)
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    else:
        logger.info(f"EXPORT_PDF|user_id={current_user_id}|count={len(transactions)}")
        pdf_content = generate_pdf_report(
            transactions, user_name, category_summary, start_date, end_date
        )
        return StreamingResponse(
            io.BytesIO(pdf_content),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )


@router.get("/category/{category_id}")
async def category_report(
    category_id: int,
    request: Request,
    format: str = Query("csv", enum=["csv", "pdf"]),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    type: str = Query("all", enum=["all", "income", "expense"]),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate category-wise report with summary stats."""
    client_ip = request.client.host if request.client else "unknown"

    logger.info(f"CATEGORY_REPORT|user_id={current_user_id}|category_id={category_id}|format={format}|ip={client_ip}")

    from categories_app.models.category import Category
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user_id
    ).first()

    if not category:
        logger.error(f"CATEGORY_REPORT_FAIL|category_id={category_id}|reason=not_found_or_not_owned")
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Category not found")

    user = db.query(User).filter(User.id == current_user_id).first()
    user_name = user.full_name or user.email if user else "Unknown"

    transactions = get_transactions_for_report(
        db, current_user_id, start_date, end_date, category_id, type
    )

    from sqlalchemy import func
    from reports_app.models.transaction import Transaction
    category_summary_data = (
        db.query(
            Category.id.label("category_id"),
            Category.name.label("category_name"),
            Category.color.label("category_color"),
            Transaction.type,
            func.sum(Transaction.amount).label("total"),
            func.count(Transaction.id).label("count")
        )
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(
            Transaction.user_id == current_user_id,
            Category.id == category_id
        )
    )

    if start_date:
        category_summary_data = category_summary_data.filter(Transaction.date >= start_date)
    if end_date:
        category_summary_data = category_summary_data.filter(Transaction.date <= end_date)

    category_summary_data = category_summary_data.group_by(Category.id, Transaction.type).all()

    category_summary = []
    cat_item = type('CategorySummaryItem', (), {
        'category_id': category_id,
        'category_name': category.name,
        'category_color': category.color,
        'total_income': 0.0,
        'total_expense': 0.0,
        'transaction_count': 0
    })()

    for row in category_summary_data:
        if row.type == "income":
            cat_item.total_income = float(row.total or 0)
        else:
            cat_item.total_expense = float(row.total or 0)
        cat_item.transaction_count += row.count or 0

    category_summary = [cat_item]

    filename = f"category_report_{category.name}_{start_date or 'start'}_to_{end_date or 'end'}.{format}"

    if format == "csv":
        logger.info(f"CATEGORY_EXPORT_CSV|category_id={category_id}|count={len(transactions)}")
        csv_content = generate_csv_report(transactions, category_summary, start_date, end_date)
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    else:
        logger.info(f"CATEGORY_EXPORT_PDF|category_id={category_id}|count={len(transactions)}")
        pdf_content = generate_pdf_report(
            transactions, user_name, category_summary, start_date, end_date
        )
        return StreamingResponse(
            io.BytesIO(pdf_content),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )


@router.get("/summary")
async def summary_report(
    request: Request,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    format: str = Query("csv", enum=["csv", "pdf"]),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate income/expense summary report."""
    client_ip = request.client.host if request.client else "unknown"

    logger.info(f"SUMMARY_REPORT|user_id={current_user_id}|format={format}|start={start_date}|end={end_date}|ip={client_ip}")

    user = db.query(User).filter(User.id == current_user_id).first()
    user_name = user.full_name or user.email if user else "Unknown"

    transactions = get_transactions_for_report(
        db, current_user_id, start_date, end_date, None, "all"
    )

    category_summary = get_category_summary(db, current_user_id, start_date, end_date)

    filename = f"summary_report_{start_date or 'start'}_to_{end_date or 'end'}.{format}"

    if format == "csv":
        logger.info(f"SUMMARY_EXPORT_CSV|user_id={current_user_id}|count={len(transactions)}")
        csv_content = generate_csv_report(transactions, category_summary, start_date, end_date)
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    else:
        logger.info(f"SUMMARY_EXPORT_PDF|user_id={current_user_id}|count={len(transactions)}")
        pdf_content = generate_pdf_report(
            transactions, user_name, category_summary, start_date, end_date
        )
        return StreamingResponse(
            io.BytesIO(pdf_content),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )