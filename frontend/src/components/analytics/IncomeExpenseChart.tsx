import { ResponsiveBar } from '@nivo/bar';
import type { IncomeVsExpenseDTO } from '@/types/analytics.types';

interface IncomeExpenseChartProps {
  data: IncomeVsExpenseDTO | undefined;
  isLoading?: boolean;
}

export function IncomeExpenseChart({ data, isLoading }: IncomeExpenseChartProps) {
  if (isLoading) return <div className="skeleton-card h-80" />;
  if (!data?.months.length) return <div className="text-center text-gray-500 py-12">No data available</div>;

  const chartData = data.months.map((month, idx) => ({
    month,
    Income: data.income[idx] || 0,
    Expense: data.expense[idx] || 0,
  }));

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="card" style={{ height: 400 }}>
      <h3 className="text-lg font-semibold mb-4">Income vs Expense by Month</h3>
      <ResponsiveBar
        data={chartData}
        keys={['Income', 'Expense']}
        indexBy="month"
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        colors={['#22c55e', '#ef4444']}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Month',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'Amount (₹)',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        theme={{
          text: { fill: isDark ? '#f8fafc' : '#111827' },
          axis: { ticks: { text: { fill: isDark ? '#cbd5e1' : '#4b5563' } } },
          grid: { line: { stroke: isDark ? '#334155' : '#e5e7eb' } },
          tooltip: {
            container: {
              background: isDark ? '#1e293b' : '#f9fafb',
              color: isDark ? '#f8fafc' : '#111827',
            },
          },
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 0,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle' as const,
            itemTextColor: isDark ? '#f8fafc' : '#111827',
          },
        ]}
      />
    </div>
  );
}
