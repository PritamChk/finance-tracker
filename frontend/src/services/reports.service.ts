import axios from 'axios';
import type { ReportQueryParams, MonthlyReport, YearlyReport } from '@/types/reports.types';

const api = axios.create({
  baseURL: import.meta.env.VITE_REPORTS_API_URL || 'http://localhost:8006',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const getFilename = (defaultName: string, contentDisposition?: string): string => {
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
    if (match) return match[1];
  }
  return defaultName;
};

const downloadBlob = (response: unknown, defaultFilename: string) => {
  const axiosResponse = response as { data: Blob; headers: { 'content-disposition'?: string } };
  const contentDisposition = axiosResponse.headers['content-disposition'];
  const filename = getFilename(defaultFilename, contentDisposition);
  const url = window.URL.createObjectURL(axiosResponse.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const reportsService = {
  exportTransactions: async (params: ReportQueryParams) => {
    const response = await api.get('/api/reports/transactions', {
      params,
      responseType: 'blob',
    });
    const filename = `report_${params.start_date || 'start'}_to_${params.end_date || 'end'}.${params.format || 'csv'}`;
    downloadBlob(response, filename);
  },

  exportCategoryReport: async (categoryId: number, params: ReportQueryParams) => {
    const response = await api.get(`/api/reports/category/${categoryId}`, {
      params,
      responseType: 'blob',
    });
    const filename = `category_report_${categoryId}_${params.start_date || 'start'}_to_${params.end_date || 'end'}.${params.format || 'csv'}`;
    downloadBlob(response, filename);
  },

  exportSummary: async (params: ReportQueryParams) => {
    const response = await api.get('/api/reports/summary', {
      params,
      responseType: 'blob',
    });
    const filename = `summary_report_${params.start_date || 'start'}_to_${params.end_date || 'end'}.${params.format || 'csv'}`;
    downloadBlob(response, filename);
  },

  getMonthlyReport: (year: number, month: number): Promise<MonthlyReport> =>
    api.get<MonthlyReport>('/api/reports/monthly', { params: { year, month } }).then(r => r.data),

  getYearlyReport: (year: number): Promise<YearlyReport> =>
    api.get<YearlyReport>('/api/reports/yearly', { params: { year } }).then(r => r.data),
};