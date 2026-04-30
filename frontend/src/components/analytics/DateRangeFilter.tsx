import { useState } from 'react';
import type { DateRange } from '@/types/analytics.types';

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  isLoading?: boolean;
}

const PRESETS = [
  { label: 'Last 30 Days', value: 'last30' as const },
  { label: 'Last 3 Months', value: 'last3months' as const },
  { label: 'Last 6 Months', value: 'last6months' as const },
  { label: 'This Year', value: 'thisyear' as const },
];

export function DateRangeFilter({ value, onChange, isLoading }: DateRangeFilterProps) {
  const [custom, setCustom] = useState(false);

  return (
    <div className="card mb-6">
      <div className="flex flex-wrap gap-2 mb-3">
        {PRESETS.map(p => (
          <button
            key={p.value}
            disabled={isLoading}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              value.preset === p.value && !custom
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => { setCustom(false); onChange({ preset: p.value }); }}
          >
            {p.label}
          </button>
        ))}
        <button
          disabled={isLoading}
          className={`px-3 py-1.5 text-sm rounded-md border ${
            custom ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => { setCustom(true); onChange({ start_date: '', end_date: '' }); }}
        >
          Custom
        </button>
      </div>
      {custom && (
        <div className="flex gap-3 items-center">
          <label className="text-sm text-gray-600">
            From
            <input
              type="date"
              className="input input-sm ml-2"
              value={value.start_date || ''}
              onChange={e => onChange({ ...value, start_date: e.target.value, preset: undefined })}
            />
          </label>
          <label className="text-sm text-gray-600">
            To
            <input
              type="date"
              className="input input-sm ml-2"
              value={value.end_date || ''}
              onChange={e => onChange({ ...value, end_date: e.target.value, preset: undefined })}
            />
          </label>
        </div>
      )}
    </div>
  );
}
