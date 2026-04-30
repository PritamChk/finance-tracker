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
    queryKey: ['transactions', params.user_id, params],
    queryFn: () => transactionsService.list(params),
    enabled: !!params.user_id,
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

export function useCreateTransaction(userId: number) {
  const queryClient = useQueryClient();
  return useMutation<TransactionDTO, Error, CreateTransactionData>({
    mutationFn: (data) => transactionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary', userId] });
    },
  });
}

export function useUpdateTransaction(userId: number) {
  const queryClient = useQueryClient();
  return useMutation<TransactionDTO, Error, { id: number; data: UpdateTransactionData }>({
    mutationFn: ({ id, data }) => transactionsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary', userId] });
      queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] });
    },
  });
}

export function useDeleteTransaction(userId: number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary', userId] });
    },
  });
}

export function useTransactionSummary(userId: number, startDate?: string, endDate?: string) {
  return useQuery<TransactionSummary>({
    queryKey: ['transactions', 'summary', userId, startDate, endDate],
    queryFn: () => transactionsService.getSummary(userId, startDate, endDate),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}