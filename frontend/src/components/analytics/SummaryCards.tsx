import { useFormatCurrency } from '@/lib/formatters';

interface SummaryCardsProps {
  total_income: number;
  total_expense: number;
  net: number;
  isLoading?: boolean;
}

export function SummaryCards({ total_income, total_expense, net, isLoading }: SummaryCardsProps) {
  const formatCurrency = useFormatCurrency();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-card h-24" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total Income', value: total_income, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'Total Expenses', value: total_expense, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { label: 'Net Balance', value: net, color: net >= 0 ? 'text-green-600' : 'text-red-600', bg: net >= 0 ? 'bg-green-50' : 'bg-red-50', border: net >= 0 ? 'border-green-200' : 'border-red-200' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map(card => (
        <div key={card.label} className={`summary-card ${card.bg} ${card.border}`}>
          <div className="text-xs text-gray-600">{card.label}</div>
          <div className={`text-xl font-bold ${card.color}`}>
            {formatCurrency(card.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
