import { useMutation, useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports.service';
import type { ReportQueryParams } from '@/types/reports.types';

export function useReportPreview(params: ReportQueryParams | undefined) {
  return useQuery({
    queryKey: ['reportPreview', params],
    queryFn: () => params ? reportsService.getPreview(params) : Promise.resolve({ items: [], total: 0, page: 1, page_size: 7 }),
    enabled: !!params,
  });
}

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