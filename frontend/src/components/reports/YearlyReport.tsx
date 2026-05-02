import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import type { YearlyReport as YearlyReportType } from '@/types/reports.types';

interface YearlyReportProps {
  report: YearlyReportType | undefined;
  isLoading: boolean;
  year: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount || 0);
};

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const YearlyReport: React.FC<YearlyReportProps> = ({ report, isLoading, year }) => {
  const isDark = document.documentElement.classList.contains('dark');

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
        <h3 className="card-title">Yearly Report</h3>
        <p className="text-gray-500">Select a year to view report</p>
      </div>
    );
  }

  const { summary, monthly_breakdown, top_categories } = report;

  const barData = monthly_breakdown?.map((m) => ({
    month: monthNames[m.month - 1],
    Income: m.income,
    Expense: m.expense,
  })) || [];

  return (
    <div className="card yearly-report">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Year {year}</h3>

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

      {barData.length > 0 && (
        <div className="mb-3" style={{ height: '200px' }}>
          <ResponsiveBar
            data={barData}
            keys={['Income', 'Expense']}
            indexBy="month"
            margin={{ top: 10, right: 10, bottom: 30, left: 45 }}
            padding={0.3}
            groupMode="grouped"
            colors={[isDark ? '#22c55e' : '#22c55e', isDark ? '#ef4444' : '#ef4444']}
            borderRadius={4}
            axisBottom={{
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
              format: (value) => `₹${Number(value) / 1000}k`,
            }}
            enableGridY
            enableLabel={false}
            legends={[]}
            theme={{
              axis: {
                ticks: { text: { fill: isDark ? '#94a3b8' : '#6b7280', fontSize: 10 } },
              },
            }}
          />
        </div>
      )}

      {top_categories && top_categories.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Top Categories</h4>
          <div className="space-y-1">
            {top_categories.slice(0, 8).map((cat, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">{idx + 1}. {cat.category}</span>
                <span className="text-danger-600 dark:text-danger-400">{formatCurrency(cat.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearlyReport;