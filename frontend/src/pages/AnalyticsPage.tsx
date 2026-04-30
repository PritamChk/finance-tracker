import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { SummaryCards } from '@/components/analytics/SummaryCards';
import { SpendingChart } from '@/components/analytics/SpendingChart';
import { TrendChart } from '@/components/analytics/TrendChart';
import { IncomeExpenseChart } from '@/components/analytics/IncomeExpenseChart';
import { DateRangeFilter } from '@/components/analytics/DateRangeFilter';
import { useAnalyticsSummary, useSpendingByCategory, useMonthlyTrend, useIncomeVsExpense } from '@/hooks/useAnalytics';
import type { DateRange } from '@/types/analytics.types';

export function AnalyticsPage() {
  const accessToken = useAuthStore(s => s.accessToken);
  const [range, setRange] = useState<DateRange>({ preset: 'last6months' });

  // Extract user_id from JWT payload (simplified - in production use jwt-decode)
  const userId = accessToken
    ? JSON.parse(atob(accessToken.split('.')[1])).sub
    : undefined;

  const { data: summary, isLoading: sLoad } = useAnalyticsSummary(
    userId, range.start_date, range.end_date
  );
  const { data: categories, isLoading: cLoad } = useSpendingByCategory(
    userId, range.start_date, range.end_date
  );
  const { data: trend, isLoading: tLoad } = useMonthlyTrend(userId, 12);
  const { data: incomeExpense, isLoading: ieLoad } = useIncomeVsExpense(
    userId, range.start_date, range.end_date
  );

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
        <IncomeExpenseChart data={incomeExpense} isLoading={ieLoad} />
      </div>
    </div>
  );
}
