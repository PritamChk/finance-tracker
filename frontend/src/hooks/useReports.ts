import { useMutation } from '@tanstack/react-query';
import { reportsService } from '@/services/reports.service';
import type { ReportQueryParams } from '@/types/reports.types';

export function useExportTransactions() {
  return useMutation({
    mutationFn: (params: ReportQueryParams) => reportsService.exportTransactions(params),
  });
}

export function useExportCategoryReport() {
  return useMutation({
    mutationFn: ({ categoryId, params }: { categoryId: number; params: ReportQueryParams }) =>
      reportsService.exportCategoryReport(categoryId, params),
  });
}

export function useExportSummary() {
  return useMutation({
    mutationFn: (params: ReportQueryParams) => reportsService.exportSummary(params),
  });
}