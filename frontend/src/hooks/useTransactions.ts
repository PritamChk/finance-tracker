import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import transactionsService from '../services/transactions.service';
import type {
  TransactionDTO,
  CreateTransactionData,
  UpdateTransactionData,
  TransactionQueryParams,
  TransactionSummary,
} from '../types/transaction.types';

export function useTransactions(params: TransactionQueryParams) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionsService.list(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useTransaction(id: number) {
  return useQuery<TransactionDTO>({
    queryKey: ['transaction', id],
    queryFn: () => transactionsService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<TransactionDTO, Error, CreateTransactionData>({
    mutationFn: (data) => transactionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<TransactionDTO, Error, { id: number; data: UpdateTransactionData }>({
    mutationFn: ({ id, data }) => transactionsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] });
    },
  });
}

export function useTransactionSummary(startDate?: string, endDate?: string) {
  return useQuery<TransactionSummary>({
    queryKey: ['transactions', 'summary', startDate, endDate],
    queryFn: () => transactionsService.getSummary(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
}