import { ResponsivePie } from '@nivo/pie';
import type { CategorySpendingDTO } from '@/types/analytics.types';

interface SpendingChartProps {
  data: CategorySpendingDTO[];
  isLoading?: boolean;
}

function getChartColor(index: number) {
  const colors = [
    '#3b82f6', '#22c55e', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#6366f1',
  ];
  return colors[index % colors.length];
}

export function SpendingChart({ data, isLoading }: SpendingChartProps) {
  if (isLoading) return <div className="skeleton-card h-80" />;
  if (!data.length) return <div className="text-center text-gray-500 py-12">No spending data available</div>;

  const chartData = data.map((item, idx) => ({
    id: item.category_name,
    label: item.category_name,
    value: item.amount,
    color: item.category_color || getChartColor(idx),
  }));

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="card" style={{ height: 400 }}>
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
       <ResponsivePie
         data={chartData}
         margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
         innerRadius={0.5}
         padAngle={0.7}
         cornerRadius={3}
         activeOuterRadiusOffset={8}
         colors={(d) => d.data.color as string}
         borderWidth={1}
         borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
         arcLinkLabelsSkipAngle={10}
         arcLinkLabelsTextColor={isDark ? '#f8fafc' : '#111827'}
         arcLinkLabelsColor={{ from: 'color' }}
         arcLabelsTextColor={isDark ? '#f8fafc' : '#111827'}
         animate={true}
         motionConfig={{
           mass: 1,
           tension: 55,
           friction: 25,
         }}
        theme={{
          text: { fill: isDark ? '#f8fafc' : '#111827' },
          tooltip: {
            container: {
              background: isDark ? '#1e293b' : '#f9fafb',
              color: isDark ? '#f8fafc' : '#111827',
            },
          },
        }}
        legends={[
          {
            anchor: 'right',
            direction: 'column',
            translateX: 56,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            symbolShape: 'circle',
            itemTextColor: isDark ? '#f8fafc' : '#111827',
          },
        ]}
      />
    </div>
  );
}
