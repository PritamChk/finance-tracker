import { ResponsiveLine } from '@nivo/line';
import type { MonthlyTrendDTO } from '@/types/analytics.types';

interface MonthlyTrendChartProps {
  data: MonthlyTrendDTO;
  isLoading?: boolean;
}

export function MonthlyTrendChart({ data, isLoading }: MonthlyTrendChartProps) {
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
        <p className="text-gray-500 dark:text-gray-400">No trend data available</p>
      </div>
    );
  }

  const chartData = [
    {
      id: 'Income',
      color: '#22c55e',
      data: data.map(m => ({ x: m.month, y: m.income })),
    },
    {
      id: 'Expense',
      color: '#ef4444',
      data: data.map(m => ({ x: m.month, y: m.expense })),
    },
  ];

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Monthly Income vs Expense
      </h3>
      <div style={{ height: 320 }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto' }}
          curve="monotoneX"
          colors={['#22c55e', '#ef4444']}
          pointSize={6}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableArea={true}
          areaOpacity={0.1}
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
              anchor: 'bottom-right',
              direction: 'column',
              translateX: 100,
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
