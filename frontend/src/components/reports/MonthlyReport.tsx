import React from 'react';
import type { MonthlyReport as MonthlyReportType } from '@/types/reports.types';

interface MonthlyReportProps {
  report: MonthlyReportType | undefined;
  isLoading: boolean;
  year: number;
  month: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount || 0);
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthlyReport: React.FC<MonthlyReportProps> = ({ report, isLoading, year, month }) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="skeleton-header" />
        <div className="skeleton-content" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="card">
        <h3 className="card-title">Monthly Report</h3>
        <p className="text-gray-500">Select a month to view report</p>
      </div>
    );
  }

  const { summary, top_categories, daily_breakdown } = report;

  return (
    <div className="card monthly-report">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {monthNames[month - 1]} {year}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-green-50 dark:bg-green-900/20 rounded p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Income</div>
          <div className="text-sm font-semibold text-success-600 dark:text-success-400">
            {formatCurrency(summary.total_income)}
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Expenses</div>
          <div className="text-sm font-semibold text-danger-600 dark:text-danger-400">
            {formatCurrency(summary.total_expense)}
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Balance</div>
          <div className={`text-sm font-semibold ${summary.balance >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
            {formatCurrency(summary.balance)}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Transactions</div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {summary.transaction_count || 0}
          </div>
        </div>
      </div>

      {top_categories && top_categories.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Top Categories</h4>
          <div className="space-y-1">
            {top_categories.slice(0, 5).map((cat, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">{cat.category}</span>
                <span className="text-danger-600 dark:text-danger-400">{formatCurrency(cat.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {daily_breakdown && daily_breakdown.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Daily Breakdown</h4>
          <div className="space-y-1">
            {daily_breakdown.slice(0, 7).map((day, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-500">{day.date}</span>
                <div className="flex gap-2">
                  <span className="text-success-600 dark:text-success-400">+{formatCurrency(day.income)}</span>
                  <span className="text-danger-600 dark:text-danger-400">-{formatCurrency(day.expense)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;