import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import type { TransactionDTO, PaginatedTransactions, TransactionQueryParams } from '../../types/transaction.types';
import type { CategoryDTO } from '../../types/category.types';
import TransactionCard from './TransactionCard';

interface TransactionListProps {
  transactions: PaginatedTransactions | undefined;
  isLoading: boolean;
  filter: 'all' | 'income' | 'expense';
  onFilterChange: (filter: 'all' | 'income' | 'expense') => void;
  queryParams: TransactionQueryParams;
  onQueryParamsChange: (params: Partial<TransactionQueryParams>) => void;
  categories: CategoryDTO[];
  onEdit: (transaction: TransactionDTO) => void;
  onDelete: (id: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  filter,
  onFilterChange,
  queryParams,
  onQueryParamsChange,
  categories,
  onEdit,
  onDelete,
}) => {
  const [searchInput, setSearchInput] = useState(queryParams.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(queryParams.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearch !== queryParams.search) {
      onQueryParamsChange({ search: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch]);

  const categoryMap = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  const getCategoryName = (categoryId: number | null) => {
    return categoryId ? categoryMap[categoryId] : undefined;
  };

  const handlePageChange = (newPage: number) => {
    onQueryParamsChange({ page: newPage });
  };

  const handleSort = (sortBy: 'date' | 'amount' | 'created_at') => {
    const newSortOrder = queryParams.sort_by === sortBy && queryParams.sort_order === 'asc' ? 'desc' : 'asc';
    onQueryParamsChange({ sort_by: sortBy, sort_order: newSortOrder });
  };

  const items = transactions?.items || [];
  const hasData = items.length > 0;

  return (
    <div className="transaction-list">
      <div className="transaction-filters">
        <div className="filter-group">
          {(['all', 'income', 'expense'] as const).map((f) => (
            <button
              key={f}
              className={`category-filter-btn ${filter === f ? 'category-filter-btn-active' : ''}`}
              onClick={() => {
                onFilterChange(f);
                onQueryParamsChange({
                  transaction_type: f === 'all' ? undefined : f,
                  page: 1,
                });
              }}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <select
            className="input input-sm"
            value={queryParams.category_id || ''}
            onChange={(e) => {
              onQueryParamsChange({
                category_id: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              });
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group filter-dates">
          <input
            type="date"
            className="input input-sm"
            value={queryParams.start_date || ''}
            onChange={(e) => {
              const newStartDate = e.target.value || undefined;
              let newEndDate = queryParams.end_date;
              if (newStartDate && queryParams.end_date && newStartDate > queryParams.end_date) {
                newEndDate = newStartDate;
              }
              onQueryParamsChange({ start_date: newStartDate, end_date: newEndDate, page: 1 });
            }}
            placeholder="Start date"
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            className="input input-sm"
            value={queryParams.end_date || ''}
            min={queryParams.start_date || undefined}
            onChange={(e) => {
              const newEndDate = e.target.value || undefined;
              if (newEndDate && queryParams.start_date && newEndDate < queryParams.start_date) {
                return;
              }
              onQueryParamsChange({ end_date: newEndDate, page: 1 });
            }}
            placeholder="End date"
          />
        </div>

        <div className="filter-group">
          <input
            type="text"
            className="input input-sm search-input"
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <div className="transaction-sort">
        <span className="sort-label">Sort by:</span>
        <button
          className={`sort-btn ${queryParams.sort_by === 'date' ? 'sort-btn-active' : ''}`}
          onClick={() => handleSort('date')}
        >
          Date {queryParams.sort_by === 'date' && (queryParams.sort_order === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`sort-btn ${queryParams.sort_by === 'amount' ? 'sort-btn-active' : ''}`}
          onClick={() => handleSort('amount')}
        >
          Amount {queryParams.sort_by === 'amount' && (queryParams.sort_order === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`sort-btn ${queryParams.sort_by === 'created_at' ? 'sort-btn-active' : ''}`}
          onClick={() => handleSort('created_at')}
        >
          Created {queryParams.sort_by === 'created_at' && (queryParams.sort_order === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      {isLoading ? (
        <div className="transaction-loading">
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
        </div>
      ) : !hasData ? (
        <div className="transaction-empty">
          <p>No transactions found.</p>
          <p className="transaction-empty-subtext">Click "Add Transaction" to create your first one.</p>
        </div>
      ) : (
        <div className="transaction-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((transaction) => (
                <tr key={transaction.id} className="table-row">
                  <td>
                    <span className={`badge badge-${transaction.type}`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td>{transaction.description || '-'}</td>
                  <td>{getCategoryName(transaction.category_id) || '-'}</td>
                  <td>{format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                  <td className={`text-right transaction-amount transaction-amount-${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </td>
                  <td className="text-center">
                    <button className="btn btn-ghost btn-sm" onClick={() => onEdit(transaction)}>
                      Edit
                    </button>
                    <button className="btn btn-ghost btn-sm btn-danger-text" onClick={() => onDelete(transaction.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {transactions && transactions.total_pages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-ghost btn-sm"
            disabled={!transactions.has_previous}
            onClick={() => handlePageChange(transactions.page - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {transactions.page} of {transactions.total_pages}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            disabled={!transactions.has_next}
            onClick={() => handlePageChange(transactions.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;