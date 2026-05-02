export interface AnalyticsSummaryDTO {
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
  average_expense: number;
  top_spending_category: string | null;
}

export interface CategorySpendingDTO {
  category_id: number | null;
  category_name: string;
  category_color: string | null;
  amount: number;
  percentage: number;
}

export interface MonthlyDataDTO {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export type MonthlyTrendDTO = MonthlyDataDTO[];

export interface IncomeExpenseDTO {
  income: number;
  expense: number;
  balance: number;
  savings_rate: number;
}

export interface DateRange {
  start_date?: string;
  end_date?: string;
  preset?: 'last30' | 'last3months' | 'last6months' | 'thisyear';
}
