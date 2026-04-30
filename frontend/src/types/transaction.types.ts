export interface TransactionDTO {
  id: number;
  user_id: number;
  category_id: number | null;
  type: "income" | "expense";
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
}

export interface CreateTransactionData {
  type: "income" | "expense";
  amount: number;
  description?: string;
  date: string;
  user_id: number;
  category_id?: number;
}

export interface UpdateTransactionData {
  type?: "income" | "expense";
  amount?: number;
  description?: string;
  date?: string;
  category_id?: number;
}

export interface TransactionQueryParams {
  user_id: number;
  transaction_type?: "income" | "expense";
  category_id?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  sort_by?: "date" | "amount" | "created_at";
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface PaginatedTransactions {
  items: TransactionDTO[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface TransactionSummary {
  total_income: number;
  total_expense: number;
  net: number;
  count: number;
}