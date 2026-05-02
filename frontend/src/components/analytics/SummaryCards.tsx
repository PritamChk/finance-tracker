import { useFormatCurrency } from '@/lib/formatters';

interface SummaryCardsProps {
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
  average_expense: number;
  top_spending_category?: string | null;
  isLoading?: boolean;
}

export function SummaryCards({
  total_income, total_expense, balance, transaction_count, average_expense, isLoading
}: SummaryCardsProps) {
  const formatCurrency = useFormatCurrency();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total Income', value: total_income, color: 'text-green-600 dark:text-green-400' },
    { label: 'Total Expense', value: total_expense, color: 'text-danger-600 dark:text-danger-400' },
    { label: 'Net Balance', value: balance, color: balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-danger-600 dark:text-danger-400' },
    { label: 'Transactions', value: transaction_count, color: 'text-primary-600 dark:text-primary-400', isCount: true },
    { label: 'Avg Expense', value: average_expense, color: 'text-gray-600 dark:text-gray-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(card => (
        <div key={card.label} className="card p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.label}</div>
          <div className={`text-lg font-bold ${card.color}`}>
            {card.isCount ? card.value : formatCurrency(card.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
