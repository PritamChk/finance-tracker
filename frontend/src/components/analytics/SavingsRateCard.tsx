import { useFormatCurrency } from '@/lib/formatters';

interface SavingsRateCardProps {
  income: number;
  expense: number;
  savings_rate: number;
  isLoading?: boolean;
}

export function SavingsRateCard({ income, expense, savings_rate, isLoading }: SavingsRateCardProps) {
  const formatCurrency = useFormatCurrency();

  if (isLoading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>
    );
  }

  const rateColor =
    savings_rate >= 20 ? 'text-green-600 dark:text-green-400' :
    savings_rate >= 0 ? 'text-amber-600 dark:text-amber-400' :
    'text-danger-600 dark:text-danger-400';

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Savings Rate
      </h3>
      <div className={`text-3xl font-bold ${rateColor}`}>
        {savings_rate.toFixed(1)}%
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Income: {formatCurrency(income)} → Expense: {formatCurrency(expense)}
      </p>
      <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${savings_rate >= 0 ? 'bg-green-500' : 'bg-danger-500'}`}
          style={{ width: `${Math.min(Math.max(savings_rate, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
