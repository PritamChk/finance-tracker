import { ResponsiveBar } from '@nivo/bar';
import type { MonthlyTrendDTO } from '@/types/analytics.types';

interface IncomeExpenseBarProps {
  data: MonthlyTrendDTO;
  isLoading?: boolean;
}

export function IncomeExpenseBar({ data, isLoading }: IncomeExpenseBarProps) {
  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
        <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="card p-6 flex items-center justify-center h-80">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const chartData = data.map(point => ({
    month: point.month,
    Income: point.income,
    Expense: point.expense,
  }));

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Income vs Expense by Month
      </h3>
      <div style={{ height: 320 }}>
        <ResponsiveBar
          data={chartData}
          keys={['Income', 'Expense']}
          indexBy="month"
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          groupMode="grouped"
          colors={['#22c55e', '#ef4444']}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisBottom={{
            tickRotation: -45,
            legend: 'Month',
            legendOffset: 36,
            tickPadding: 5,
          }}
          axisLeft={{
            legend: 'Amount (₹)',
            legendOffset: -40,
            tickPadding: 5,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          theme={{
            text: { fill: isDark ? '#e5e7eb' : '#374151' },
            axis: { ticks: { text: { fill: isDark ? '#9ca3af' : '#4b5563' } } },
            grid: { line: { stroke: isDark ? '#374151' : '#e5e7eb' } },
            tooltip: {
              container: {
                background: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#f9fafb' : '#111827',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              },
            },
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              translateX: 0,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 12,
              symbolShape: 'circle',
              itemTextColor: isDark ? '#e5e7eb' : '#374151',
            },
          ]}
        />
      </div>
    </div>
  );
}
