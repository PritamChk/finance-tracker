import axios from 'axios';
import type { AnalyticsSummaryDTO, CategorySpendingDTO, MonthlyTrendDTO, IncomeVsExpenseDTO } from '@/types/analytics.types';

const api = axios.create({
  baseURL: import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:8005',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const analyticsService = {
  getSummary: (userId: number, start_date?: string, end_date?: string) =>
    api.get<AnalyticsSummaryDTO>('/api/analytics/summary', {
      params: { user_id: userId, start_date, end_date },
    }).then(r => r.data),

  getSpendingByCategory: (userId: number, start_date?: string, end_date?: string) =>
    api.get<CategorySpendingDTO[]>('/api/analytics/spending-by-category', {
      params: { user_id: userId, start_date, end_date },
    }).then(r => r.data),

  getMonthlyTrend: (userId: number, months = 12) =>
    api.get<MonthlyTrendDTO>('/api/analytics/monthly-trend', {
      params: { user_id: userId, months },
    }).then(r => r.data),

  getIncomeVsExpense: (userId: number, start_date?: string, end_date?: string) =>
    api.get<IncomeVsExpenseDTO>('/api/analytics/income-vs-expense', {
      params: { user_id: userId, start_date, end_date },
    }).then(r => r.data),
};
