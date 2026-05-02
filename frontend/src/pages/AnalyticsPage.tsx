import { useState } from 'react';
import { SummaryCards } from '@/components/analytics/SummaryCards';
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/analytics/MonthlyTrendChart';
import { IncomeExpenseBar } from '@/components/analytics/IncomeExpenseBar';
import { SavingsRateCard } from '@/components/analytics/SavingsRateCard';
import { DateRangeFilter } from '@/components/analytics/DateRangeFilter';
import { useAnalyticsSummary, useSpendingByCategory, useMonthlyTrend, useIncomeVsExpense } from '@/hooks/useAnalytics';
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
  const { data: incomeExpense, isLoading: ieLoad } = useIncomeVsExpense(
    range.start_date, range.end_date
  );

  return (
    <div className="w-full px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <DateRangeFilter value={range} onChange={setRange} isLoading={sLoad} />
      </div>

      <SummaryCards
        total_income={summary?.total_income ?? 0}
        total_expense={summary?.total_expense ?? 0}
        balance={summary?.balance ?? 0}
        transaction_count={summary?.transaction_count ?? 0}
        average_expense={summary?.average_expense ?? 0}
        top_spending_category={summary?.top_spending_category}
        isLoading={sLoad}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CategoryPieChart data={categories ?? []} isLoading={cLoad} />
        <div className="space-y-6">
          <SavingsRateCard
            income={incomeExpense?.income ?? 0}
            expense={incomeExpense?.expense ?? 0}
            savings_rate={incomeExpense?.savings_rate ?? 0}
            isLoading={ieLoad}
          />
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Top Category
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {summary?.top_spending_category ?? '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        <MonthlyTrendChart data={trend ?? []} isLoading={tLoad} />
        <IncomeExpenseBar data={trend ?? []} isLoading={tLoad} />
      </div>
    </div>
  );
}
