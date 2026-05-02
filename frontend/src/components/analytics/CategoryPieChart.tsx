import { ResponsivePie } from '@nivo/pie';
import type { CategorySpendingDTO } from '@/types/analytics.types';

interface CategoryPieChartProps {
  data: CategorySpendingDTO[];
  isLoading?: boolean;
}

export function CategoryPieChart({ data, isLoading }: CategoryPieChartProps) {
  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="card p-6 flex items-center justify-center h-80">
        <p className="text-gray-500 dark:text-gray-400">No spending data for this period</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    id: item.category_name,
    label: item.category_name,
    value: item.amount,
    color: item.category_color || '#6b7280',
  }));

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Spending by Category
      </h3>
      <div style={{ height: 320 }}>
        <ResponsivePie
          data={chartData}
          margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={(d: any) => d.data.color}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
          arcLinkLabelsColor={isDark ? '#e5e7eb' : '#374151'}
          arcLinkLabelsTextColor={isDark ? '#e5e7eb' : '#374151'}
          arcLabelsTextColor="#ffffff"
          animate={true}
          motionConfig="gentle"
          theme={{
            text: { fill: isDark ? '#e5e7eb' : '#374151' },
            tooltip: {
              container: {
                background: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#f9fafb' : '#111827',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              },
            },
          }}
        />
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        {chartData.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {item.label} ({((item.value / data.reduce((s, d) => s + d.amount, 0)) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
