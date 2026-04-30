import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import type {
  AnalyticsSummaryDTO,
  CategorySpendingDTO,
  MonthlyTrendDTO,
  IncomeVsExpenseDTO,
} from '@/types/analytics.types';

const STALE_TIME = 5 * 60 * 1000;

export function useAnalyticsSummary(userId?: number, start_date?: string, end_date?: string) {
  return useQuery<AnalyticsSummaryDTO>({
    queryKey: ['analytics', 'summary', userId, start_date, end_date],
    queryFn: () => analyticsService.getSummary(userId!, start_date, end_date),
    staleTime: STALE_TIME,
    enabled: !!userId,
  });
}

export function useSpendingByCategory(userId?: number, start_date?: string, end_date?: string) {
  return useQuery<CategorySpendingDTO[]>({
    queryKey: ['analytics', 'spending-by-category', userId, start_date, end_date],
    queryFn: () => analyticsService.getSpendingByCategory(userId!, start_date, end_date),
    staleTime: STALE_TIME,
    enabled: !!userId,
  });
}

export function useMonthlyTrend(userId?: number, months = 12) {
  return useQuery<MonthlyTrendDTO>({
    queryKey: ['analytics', 'monthly-trend', userId, months],
    queryFn: () => analyticsService.getMonthlyTrend(userId!, months),
    staleTime: STALE_TIME,
    enabled: !!userId,
  });
}

export function useIncomeVsExpense(userId?: number, start_date?: string, end_date?: string) {
  return useQuery<IncomeVsExpenseDTO>({
    queryKey: ['analytics', 'income-vs-expense', userId, start_date, end_date],
    queryFn: () => analyticsService.getIncomeVsExpense(userId!, start_date, end_date),
    staleTime: STALE_TIME,
    enabled: !!userId,
  });
}
