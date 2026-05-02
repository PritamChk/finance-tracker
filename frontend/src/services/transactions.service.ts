import axios from 'axios';
import type {
  TransactionDTO,
  CreateTransactionData,
  UpdateTransactionData,
  TransactionQueryParams,
  PaginatedTransactions,
  TransactionSummary,
} from '../types/transaction.types';

const TRANSACTIONS_API_URL = import.meta.env.VITE_TRANSACTIONS_API_URL || 'http://localhost:8003';

const transactionsApi = axios.create({
  baseURL: TRANSACTIONS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

transactionsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const transactionsService = {
  async list(params: TransactionQueryParams): Promise<PaginatedTransactions> {
    const searchParams = new URLSearchParams();
    
    if (params.transaction_type) searchParams.append('transaction_type', params.transaction_type);
    if (params.category_id) searchParams.append('category_id', String(params.category_id));
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.search) searchParams.append('search', params.search);
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.page_size) searchParams.append('page_size', String(params.page_size));

    const response = await transactionsApi.get<PaginatedTransactions>(`/api/transactions?${searchParams.toString()}`);
    return response.data;
  },

  async create(data: CreateTransactionData): Promise<TransactionDTO> {
    const response = await transactionsApi.post<TransactionDTO>('/api/transactions', data);
    return response.data;
  },

  async getById(id: number): Promise<TransactionDTO> {
    const response = await transactionsApi.get<TransactionDTO>(`/api/transactions/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateTransactionData): Promise<TransactionDTO> {
    const response = await transactionsApi.put<TransactionDTO>(`/api/transactions/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await transactionsApi.delete(`/api/transactions/${id}`);
  },

  async getSummary(startDate?: string, endDate?: string): Promise<TransactionSummary> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await transactionsApi.get<TransactionSummary>(`/api/transactions/summary?${params.toString()}`);
    return response.data;
  },
};

export default transactionsService;