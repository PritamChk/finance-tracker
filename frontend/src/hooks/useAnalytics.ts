import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import type {
  AnalyticsSummaryDTO,
  CategorySpendingDTO,
  MonthlyTrendDTO,
  IncomeExpenseDTO,
} from '@/types/analytics.types';

const STALE_TIME = 5 * 60 * 1000;

export function useAnalyticsSummary(start_date?: string, end_date?: string) {
  return useQuery<AnalyticsSummaryDTO>({
    queryKey: ['analytics', 'summary', start_date, end_date],
    queryFn: () => analyticsService.getSummary(start_date, end_date),
    staleTime: STALE_TIME,
  });
}

export function useSpendingByCategory(start_date?: string, end_date?: string) {
  return useQuery<CategorySpendingDTO[]>({
    queryKey: ['analytics', 'spending-by-category', start_date, end_date],
    queryFn: () => analyticsService.getSpendingByCategory(start_date, end_date),
    staleTime: STALE_TIME,
  });
}

export function useMonthlyTrend(months = 12) {
  return useQuery<MonthlyTrendDTO>({
    queryKey: ['analytics', 'monthly-trend', months],
    queryFn: () => analyticsService.getMonthlyTrend(months),
    staleTime: STALE_TIME,
  });
}

export function useIncomeVsExpense(start_date?: string, end_date?: string) {
  return useQuery<IncomeExpenseDTO>({
    queryKey: ['analytics', 'income-vs-expense', start_date, end_date],
    queryFn: () => analyticsService.getIncomeVsExpense(start_date, end_date),
    staleTime: STALE_TIME,
  });
}
