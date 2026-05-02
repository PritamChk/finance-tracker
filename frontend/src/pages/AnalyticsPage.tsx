import { useState } from 'react';
import { SummaryCards } from '@/components/analytics/SummaryCards';
import { SpendingChart } from '@/components/analytics/SpendingChart';
import { TrendChart } from '@/components/analytics/TrendChart';
import { IncomeExpenseChart } from '@/components/analytics/IncomeExpenseChart';
import { DateRangeFilter } from '@/components/analytics/DateRangeFilter';
import { useAnalyticsSummary, useSpendingByCategory, useMonthlyTrend } from '@/hooks/useAnalytics';
import type { DateRange } from '@/types/analytics.types';

export function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>({ preset: 'last6months' });

  const { data: summary, isLoading: sLoad } = useAnalyticsSummary(
    range.start_date, range.end_date
  );
  const { data: categories, isLoading: cLoad } = useSpendingByCategory(
    range.start_date, range.end_date
  );
  const { data: trend, isLoading: tLoad } = useMonthlyTrend(12);

  return (
    <div className="analytics-page" style={{ width: '100%', maxWidth: 'none', padding: '1.5rem' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <DateRangeFilter value={range} onChange={setRange} isLoading={sLoad} />
      </div>

      <SummaryCards
        total_income={summary?.total_income || 0}
        total_expense={summary?.total_expense || 0}
        net={summary?.net || 0}
        isLoading={sLoad}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
        <SpendingChart data={categories || []} isLoading={cLoad} />
        <TrendChart data={trend} isLoading={tLoad} />
        <div style={{ gridColumn: '1 / -1' }}><IncomeExpenseChart data={trend} isLoading={tLoad} /></div>
      </div>
    </div>
  );
}
