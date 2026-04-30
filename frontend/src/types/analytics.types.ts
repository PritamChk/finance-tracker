export interface AnalyticsSummaryDTO {
  total_income: number;
  total_expense: number;
  net: number;
  count: number;
  start_date?: string;
  end_date?: string;
}

export interface CategorySpendingDTO {
  category_id: number;
  category_name: string;
  category_color: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrendPointDTO {
  month: string;
  income: number;
  expense: number;
}

export interface MonthlyTrendDTO {
  months: MonthlyTrendPointDTO[];
  start_month: string;
  end_month: string;
}

export interface IncomeVsExpenseDTO {
  labels: string[];
  income: number[];
  expense: number[];
  months: string[];
}

export interface DateRange {
  start_date?: string;
  end_date?: string;
  preset?: 'last30' | 'last3months' | 'last6months' | 'thisyear';
}
