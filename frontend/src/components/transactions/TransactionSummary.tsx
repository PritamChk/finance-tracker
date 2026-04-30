import React from 'react';
import type { TransactionSummary as TransactionSummaryType } from '../../types/transaction.types';

interface TransactionSummaryProps {
  summary: TransactionSummaryType | undefined;
  isLoading: boolean;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="summary-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  const netClass = summary.net >= 0 ? 'summary-value-positive' : 'summary-value-negative';

  return (
    <div className="summary-grid">
      <div className="summary-card summary-card-income">
        <div className="summary-label">Total Income</div>
        <div className="summary-value summary-value-income">
          {formatCurrency(summary.total_income)}
        </div>
        <div className="summary-count">{summary.count} transactions</div>
      </div>

      <div className="summary-card summary-card-expense">
        <div className="summary-label">Total Expenses</div>
        <div className="summary-value summary-value-expense">
          {formatCurrency(summary.total_expense)}
        </div>
        <div className="summary-count">-</div>
      </div>

      <div className="summary-card summary-card-net">
        <div className="summary-label">Net Balance</div>
        <div className={`summary-value ${netClass}`}>
          {formatCurrency(summary.net)}
        </div>
        <div className="summary-count">
          {summary.net >= 0 ? 'Positive' : 'Negative'}
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;