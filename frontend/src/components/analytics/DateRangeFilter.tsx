import { useState } from 'react';
import type { DateRange } from '@/types/analytics.types';

const PRESETS = [
  { label: 'Last 30 Days', value: 'last30' as const },
  { label: 'Last 3 Months', value: 'last3months' as const },
  { label: 'Last 6 Months', value: 'last6months' as const },
  { label: 'This Year', value: 'thisyear' as const },
];

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  isLoading?: boolean;
}

export function DateRangeFilter({ value, onChange, isLoading }: DateRangeFilterProps) {
  const [custom, setCustom] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map(p => (
        <button
          key={p.value}
          disabled={isLoading}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
            value.preset === p.value && !custom
              ? 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          onClick={() => { setCustom(false); onChange({ preset: p.value }); }}
        >
          {p.label}
        </button>
      ))}
      <button
        disabled={isLoading}
        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
          custom
            ? 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
        onClick={() => { setCustom(true); onChange({ start_date: '', end_date: '' }); }}
      >
        Custom
      </button>
      {custom && (
        <div className="flex gap-3 items-center ml-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            From
            <input
              type="date"
              className="input input-sm ml-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              value={value.start_date || ''}
              onChange={e => onChange({ ...value, start_date: e.target.value, preset: undefined })}
            />
          </label>
          <label className="text-sm text-gray-600 dark:text-gray-400">
            To
            <input
              type="date"
              className="input input-sm ml-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              value={value.end_date || ''}
              onChange={e => onChange({ ...value, end_date: e.target.value, preset: undefined })}
            />
          </label>
        </div>
      )}
    </div>
  );
}
