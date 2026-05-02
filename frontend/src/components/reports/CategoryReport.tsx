import React from 'react';
import type { TransactionExport } from '@/types/reports.types';

interface CategoryReportProps {
  categoryId: number;
  categoryName: string;
  topCategories?: { category: string; amount: number }[];
  transactions: TransactionExport[];
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount || 0);
};

const CategoryReport: React.FC<CategoryReportProps> = ({
  categoryId: _categoryId,
  categoryName,
  topCategories: _topCategories,
  transactions,
  isLoading,
}) => {
  void _categoryId;
  void _topCategories;
  if (isLoading) {
    return (
      <div className="card">
        <div className="skeleton-header" />
        <div className="skeleton-content" />
      </div>
    );
  }

  const categoryTransactions = transactions.filter(
    (t) => t.category_name?.toLowerCase() === categoryName.toLowerCase()
  );

  const totalIncome = categoryTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = categoryTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalAmount = totalIncome + totalExpense;
  const avgAmount = categoryTransactions.length > 0 ? totalAmount / categoryTransactions.length : 0;

  return (
    <div className="category-report text-sm">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {formatCurrency(totalAmount)}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Income</div>
          <div className="text-sm font-semibold text-success-600 dark:text-success-400">
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Expense</div>
          <div className="text-sm font-semibold text-danger-600 dark:text-danger-400">
            {formatCurrency(totalExpense)}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Count</div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {categoryTransactions.length}
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Average</div>
          <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
            {formatCurrency(avgAmount)}
          </div>
        </div>
      </div>

      {categoryTransactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {categoryTransactions.slice(0, 10).map((t, idx) => (
                <tr key={idx} className="text-xs">
                  <td>{t.date?.substring(0, 10) || '-'}</td>
                  <td>
                    <span className={`badge badge-${t.type}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="max-w-[150px] truncate">{t.description || '-'}</td>
                  <td className={t.type === 'income' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryReport;