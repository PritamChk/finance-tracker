import csv
import io
from datetime import datetime
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func
from loguru import logger

# Import shared User model
from shared.models.user import User

# Import models from local module
from reports_app.models.transaction import Transaction
from reports_app.models.category import Category

from reports_app.schemas.reports import (
    CategorySummaryItem,
)


def get_transactions_for_report(
    db: Session,
    user_id: int,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category_id: Optional[int] = None,
    type_filter: Optional[str] = "all"
) -> List[Transaction]:
    """Fetch transactions with filters for report generation."""
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if type_filter and type_filter != "all":
        query = query.filter(Transaction.type == type_filter)

    query = query.order_by(Transaction.date.desc())
    return query.all()


def get_transactions_for_preview(
    db: Session,
    user_id: int,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category_id: Optional[int] = None,
    type_filter: Optional[str] = "all",
    limit: int = 7
) -> tuple[List[Transaction], int]:
    """Fetch transactions with limit for preview + total count."""
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if type_filter and type_filter != "all":
        query = query.filter(Transaction.type == type_filter)

    total_count = query.count()
    transactions = query.order_by(Transaction.date.desc()).limit(limit).all()

    return transactions, total_count


def get_category_summary(
    db: Session,
    user_id: int,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> List[CategorySummaryItem]:
    """Get category-wise summary for report."""
    from sqlalchemy import func

    query = (
        db.query(
            Category.id.label("category_id"),
            Category.name.label("category_name"),
            Category.color.label("category_color"),
            Transaction.type,
            func.sum(Transaction.amount).label("total"),
            func.count(Transaction.id).label("count")
        )
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(Transaction.user_id == user_id)
    )

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    query = query.group_by(Category.id, Transaction.type)

    results = query.all()

    # Aggregate by category
    category_map: Dict[int, CategorySummaryItem] = {}
    for row in results:
        cat_id = row.category_id
        if cat_id not in category_map:
            category_map[cat_id] = CategorySummaryItem(
                category_id=cat_id,
                category_name=row.category_name,
                category_color=row.category_color,
                total_income=0.0,
                total_expense=0.0,
                transaction_count=0
            )
        if row.type == "income":
            category_map[cat_id].total_income = float(row.total or 0)
        else:
            category_map[cat_id].total_expense = float(row.total or 0)
        category_map[cat_id].transaction_count += row.count or 0

    return list(category_map.values())


def generate_csv_report(
    transactions: List[Transaction],
    category_summary: List[CategorySummaryItem],
    start_date: Optional[str],
    end_date: Optional[str]
) -> str:
    """Generate CSV content for transactions report."""
    output = io.StringIO()
    writer = csv.writer(output)

    # Write header info
    writer.writerow(["Finance Tracker - Transaction Report"])
    writer.writerow([f"Period: {start_date or 'Start'} to {end_date or 'End'}"])
    writer.writerow([f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"])
    writer.writerow([])

    # Write summary
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    writer.writerow(["Summary"])
    writer.writerow(["Total Income", f"{total_income:.2f}"])
    writer.writerow(["Total Expense", f"{total_expense:.2f}"])
    writer.writerow(["Net Balance", f"{total_income - total_expense:.2f}"])
    writer.writerow(["Transaction Count", len(transactions)])
    writer.writerow([])

    # Write category summary
    if category_summary:
        writer.writerow(["Category Summary"])
        writer.writerow(["Category", "Type", "Total", "Count"])
        for cat in category_summary:
            if cat.total_income > 0:
                writer.writerow([cat.category_name, "Income", f"{cat.total_income:.2f}", cat.transaction_count])
            if cat.total_expense > 0:
                writer.writerow([cat.category_name, "Expense", f"{cat.total_expense:.2f}", cat.transaction_count])
        writer.writerow([])

    # Write transactions
    writer.writerow(["Transactions"])
    writer.writerow(["Date", "Category", "Type", "Amount", "Description"])

    for txn in transactions:
        category_name = txn.category.name if txn.category else "Uncategorized"
        writer.writerow([
            txn.date,
            category_name,
            txn.type,
            f"{txn.amount:.2f}",
            txn.description or ""
        ])

    return output.getvalue()


def generate_pdf_report(
    transactions: List[Transaction],
    user_name: str,
    category_summary: List[CategorySummaryItem],
    start_date: Optional[str],
    end_date: Optional[str]
) -> bytes:
    """Generate PDF report with header, transaction table, and summary."""
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    from reportlab.platypus import (
        SimpleDocTemplate, Table, TableStyle, Paragraph,
        Spacer, PageBreak
    )
    from reportlab.lib.units import inch
    from io import BytesIO

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=18)

    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#1f2937'),
        spaceAfter=30,
        alignment=1  # Center
    )
    story.append(Paragraph("Finance Tracker - Transaction Report", title_style))
    story.append(Spacer(1, 0.2 * inch))

    # Header info
    header_style = ParagraphStyle(
        'HeaderInfo',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#6b7280')
    )
    story.append(Paragraph(f"User: {user_name}", header_style))
    story.append(Paragraph(f"Period: {start_date or 'Start'} to {end_date or 'End'}", header_style))
    story.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", header_style))
    story.append(Paragraph(f"Format: PDF", header_style))
    story.append(Spacer(1, 0.3 * inch))

    # Summary Section
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    net_balance = total_income - total_expense

    story.append(Paragraph("Summary", styles['Heading2']))
    summary_data = [
        ["Total Income", f"Rs. {total_income:,.2f}"],
        ["Total Expense", f"Rs. {total_expense:,.2f}"],
        ["Net Balance", f"Rs. {net_balance:,.2f}"],
        ["Transaction Count", str(len(transactions))]
    ]
    summary_table = Table(summary_data, colWidths=[2.5 * inch, 2 * inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 0.3 * inch))

    # Category Summary
    if category_summary:
        story.append(Paragraph("Category Summary", styles['Heading2']))
        cat_data = [["Category", "Type", "Total", "Transactions"]]
        for cat in category_summary:
            if cat.total_income > 0:
                cat_data.append([cat.category_name, "Income", f"Rs. {cat.total_income:,.2f}", str(cat.transaction_count)])
            if cat.total_expense > 0:
                cat_data.append([cat.category_name, "Expense", f"Rs. {cat.total_expense:,.2f}", str(cat.transaction_count)])

        cat_table = Table(cat_data, colWidths=[1.5 * inch, 1 * inch, 1.5 * inch, 1 * inch])
        cat_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
        ]))
        story.append(cat_table)
        story.append(Spacer(1, 0.3 * inch))

    # Transaction Table
    story.append(Paragraph("Transactions", styles['Heading2']))
    txn_data = [["Date", "Category", "Type", "Amount", "Description"]]
    for txn in transactions:
        category_name = txn.category.name if txn.category else "Uncategorized"
        txn_data.append([
            str(txn.date),
            category_name,
            txn.type.capitalize(),
            f"Rs. {txn.amount:,.2f}",
            txn.description or ""
        ])

    txn_table = Table(txn_data, colWidths=[1 * inch, 1.5 * inch, 0.8 * inch, 1 * inch, 2 * inch])
    txn_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
    ]))
    story.append(txn_table)

    doc.build(story)
    return buffer.getvalue()
