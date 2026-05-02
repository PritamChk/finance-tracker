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
    <div className="analytics-page max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <DateRangeFilter value={range} onChange={setRange} isLoading={sLoad} />

      <SummaryCards
        total_income={summary?.total_income || 0}
        total_expense={summary?.total_expense || 0}
        net={summary?.net || 0}
        isLoading={sLoad}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SpendingChart data={categories || []} isLoading={cLoad} />
      </div>

      <div className="mb-6">
        <TrendChart data={trend} isLoading={tLoad} />
      </div>

      <div className="mb-6">
        <IncomeExpenseChart data={trend} isLoading={tLoad} />
      </div>
    </div>
  );
}
