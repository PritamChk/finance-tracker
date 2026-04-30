import React from 'react';
import { format } from 'date-fns';
import type { TransactionDTO } from '../../types/transaction.types';

interface TransactionCardProps {
  transaction: TransactionDTO;
  categoryName?: string;
  onEdit: (transaction: TransactionDTO) => void;
  onDelete: (id: number) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  categoryName,
  onEdit,
  onDelete,
}) => {
  const isIncome = transaction.type === 'income';
  const formattedAmount = `${isIncome ? '+' : '-'}₹${(transaction.amount || 0).toFixed(2)}`;
  const formattedDate = format(new Date(transaction.date), 'MMM dd, yyyy');

  return (
    <div className="transaction-card">
      <div className="transaction-card-header">
        <span className={`badge badge-${transaction.type}`}>
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </span>
        {categoryName && <span className="transaction-category">{categoryName}</span>}
      </div>
      
      <div className="transaction-card-body">
        <p className="transaction-description">
          {transaction.description || 'No description'}
        </p>
        <p className="transaction-date">{formattedDate}</p>
      </div>
      
      <div className="transaction-card-footer">
        <span className={`transaction-amount transaction-amount-${transaction.type}`}>
          {formattedAmount}
        </span>
        <div className="transaction-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onEdit(transaction)}
          >
            Edit
          </button>
          <button
            className="btn btn-ghost btn-sm btn-danger-text"
            onClick={() => onDelete(transaction.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;