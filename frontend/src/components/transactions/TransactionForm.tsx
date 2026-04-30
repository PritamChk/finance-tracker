import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TransactionDTO, CreateTransactionData } from '../../types/transaction.types';
import type { CategoryDTO } from '../../types/category.types';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0.01, 'Amount is required'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  date: z.string().min(1, 'Date is required'),
  category_id: z.number().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  transaction?: TransactionDTO | null;
  userId: number;
  categories: CategoryDTO[];
  onSubmit: (data: CreateTransactionData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  userId,
  categories,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type || 'expense',
      amount: transaction?.amount || undefined,
      description: transaction?.description || '',
      date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
      category_id: transaction?.category_id || undefined,
    },
  });

  const selectedType = watch('type');
  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const handleFormSubmit = (data: TransactionFormData) => {
    onSubmit({
      type: data.type,
      amount: data.amount,
      description: data.description || undefined,
      date: data.date,
      user_id: userId,
      category_id: data.category_id,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="transaction-form">
      <div className="form-group">
        <label className="label">Type</label>
        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn ${watch('type') === 'income' ? 'type-btn-active' : ''}`}
            onClick={() => setValue('type', 'income')}
          >
            Income
          </button>
          <button
            type="button"
            className={`type-btn ${watch('type') === 'expense' ? 'type-btn-active' : ''}`}
            onClick={() => setValue('type', 'expense')}
          >
            Expense
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          className={`input ${errors.amount ? 'input-error' : ''}`}
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && <p className="error-message">{errors.amount.message}</p>}
      </div>

      <div className="form-group">
        <label className="label" htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          className={`input ${errors.description ? 'input-error' : ''}`}
          placeholder="Enter description"
          maxLength={500}
          {...register('description')}
        />
        {errors.description && <p className="error-message">{errors.description.message}</p>}
      </div>

      <div className="form-group">
        <label className="label" htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          className={`input ${errors.date ? 'input-error' : ''}`}
          {...register('date')}
        />
        {errors.date && <p className="error-message">{errors.date.message}</p>}
      </div>

      <div className="form-group">
        <label className="label" htmlFor="category">Category (optional)</label>
        <select
          id="category"
          className="input"
          {...register('category_id', { valueAsNumber: true })}
        >
          <option value="">Select a category</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : transaction ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;