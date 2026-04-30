import React, { useState } from 'react';
import type { TransactionDTO, CreateTransactionData, TransactionQueryParams } from '../types/transaction.types';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction, useTransactionSummary } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAuthStore } from '../stores/auth.store';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionSummary from '../components/transactions/TransactionSummary';

const TransactionsPage: React.FC = () => {
  const { accessToken } = useAuthStore();
  const userId = accessToken ? 1 : 0;

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionDTO | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const [queryParams, setQueryParams] = useState<TransactionQueryParams>({
    user_id: userId,
    transaction_type: undefined,
    category_id: undefined,
    start_date: undefined,
    end_date: undefined,
    search: undefined,
    sort_by: 'date',
    sort_order: 'desc',
    page: 1,
    page_size: 20,
  });

  const { data: transactions, isLoading } = useTransactions(queryParams);
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary(userId);
  const { data: categories } = useCategories(userId);

  const createMutation = useCreateTransaction(userId);
  const updateMutation = useUpdateTransaction(userId);
  const deleteMutation = useDeleteTransaction(userId);

  const handleQueryParamsChange = (params: Partial<TransactionQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...params }));
  };

  const handleCreate = (data: CreateTransactionData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowModal(false);
      },
    });
  };

  const handleUpdate = (data: CreateTransactionData) => {
    if (!editingTransaction) return;
    updateMutation.mutate(
      {
        id: editingTransaction.id,
        data: {
          type: data.type,
          amount: data.amount,
          description: data.description,
          date: data.date,
          category_id: data.category_id,
        },
      },
      {
        onSuccess: () => {
          setShowModal(false);
          setEditingTransaction(null);
        },
      }
    );
  };

  const handleEdit = (transaction: TransactionDTO) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteRequest = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteConfirm = () => {
    if (showDeleteConfirm !== null) {
      deleteMutation.mutate(showDeleteConfirm, {
        onSuccess: () => {
          setShowDeleteConfirm(null);
        },
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1 className="page-title">Transactions</h1>
        <button
          className="btn-add-transaction"
          onClick={() => {
            setEditingTransaction(null);
            setShowModal(true);
          }}
        >
          <span className="btn-add-icon">+</span>
          <span>Add</span>
        </button>
      </div>

      <TransactionSummary summary={summary} isLoading={summaryLoading} />

      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        filter={filter}
        onFilterChange={setFilter}
        queryParams={queryParams}
        onQueryParamsChange={handleQueryParamsChange}
        categories={categories || []}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <TransactionForm
              transaction={editingTransaction}
              userId={userId}
              categories={categories || []}
              onSubmit={editingTransaction ? handleUpdate : handleCreate}
              onCancel={handleCloseModal}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}

      {showDeleteConfirm !== null && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Delete Transaction</h2>
            <p className="modal-text">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;