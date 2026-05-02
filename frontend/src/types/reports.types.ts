export type ReportFormat = 'csv' | 'pdf';
export type TransactionType = 'all' | 'income' | 'expense';

export interface ReportQueryParams {
  start_date?: string;
  end_date?: string;
  category_id?: number;
  type?: TransactionType;
  format?: ReportFormat;
}

export interface CategorySummary {
  category_id: number;
  category_name: string;
  category_color: string;
  total_income: number;
  total_expense: number;
  transaction_count: number;
}

export interface TransactionExport {
  id: number;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string | null;
  category_name: string | null;
}

export interface ExportSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
}

export interface ExportResponse {
  transactions: TransactionExport[];
  summary: ExportSummary;
  export_date: string;
}

export interface TopCategory {
  category: string;
  amount: number;
}

export interface DailyBreakdown {
  date: string;
  income: number;
  expense: number;
}

export interface MonthlyReport {
  year: number;
  month: number;
  summary: ExportSummary;
  top_categories: TopCategory[];
  daily_breakdown: DailyBreakdown[];
}

export interface MonthlyData {
  month: number;
  income: number;
  expense: number;
}

export interface YearlyReport {
  year: number;
  summary: ExportSummary;
  monthly_breakdown: MonthlyData[];
  top_categories: TopCategory[];
}

export interface CategoryReport {
  category_id: number;
  category_name: string;
  total_amount: number;
  transaction_count: number;
  average_amount: number;
  transactions: TransactionExport[];
  breakdown: {
    income: number;
    expense: number;
  };
}