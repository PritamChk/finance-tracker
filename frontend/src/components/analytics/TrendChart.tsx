import { ResponsiveLine } from '@nivo/line';
import type { MonthlyTrendDTO } from '@/types/analytics.types';

interface TrendChartProps {
  data: MonthlyTrendDTO | undefined;
  isLoading?: boolean;
}

export function TrendChart({ data, isLoading }: TrendChartProps) {
  if (isLoading) return <div className="skeleton-card h-80" />;
  if (!data?.length) return <div className="text-center text-gray-500 py-12">No trend data available</div>;

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
    <div className="card" style={{ height: 400 }}>
      <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expense</h3>
       <ResponsiveLine
         data={chartData}
         margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
         xScale={{ type: 'point' }}
         yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
         curve="monotoneX"
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
         colors={['#22c55e', '#ef4444']}
         pointSize={8}
         pointBorderWidth={2}
         pointBorderColor={{ from: 'serieColor' }}
         pointLabelYOffset={-12}
         useMesh={true}
         enableArea={true}
         areaOpacity={0.1}
         animate={true}
         motionConfig={{
           mass: 1,
           tension: 55,
           friction: 25,
         }}
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
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
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
