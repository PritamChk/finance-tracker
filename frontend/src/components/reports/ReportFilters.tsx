import React from 'react';

interface ReportFiltersProps {
  year: number;
  month: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  mode: 'monthly' | 'yearly';
  onModeChange: (mode: 'monthly' | 'yearly') => void;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentYear = new Date().getFullYear();

const ReportFilters: React.FC<ReportFiltersProps> = ({
  year,
  month,
  onYearChange,
  onMonthChange,
  mode,
  onModeChange,
}) => {
  return (
    <div className="card report-filters">
      <div className="flex items-center gap-2 text-sm">
        <button
          className={`btn btn-xs ${mode === 'monthly' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => onModeChange('monthly')}
        >
          Monthly
        </button>
        <button
          className={`btn btn-xs ${mode === 'yearly' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => onModeChange('yearly')}
        >
          Yearly
        </button>
      </div>

      <div className="mt-2">
        {mode === 'monthly' ? (
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Month:</label>
            <select
              className="input input-xs flex-1"
              value={month}
              onChange={(e) => onMonthChange(Number(e.target.value))}
            >
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx + 1}>{m}</option>
              ))}
            </select>
            <label className="text-xs text-gray-600 dark:text-gray-400">Year:</label>
            <input
              type="number"
              className="input input-xs w-16 text-center"
              value={year}
              min={1970}
              max={currentYear}
              onChange={(e) => {
                const num = Math.max(1970, Math.min(currentYear, parseInt(e.target.value, 10) || currentYear));
                onYearChange(num);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">which year:</label>
            <input
              type="number"
              className="input input-xs flex-1"
              value={year}
              min={1970}
              max={currentYear}
              onChange={(e) => {
                const num = Math.max(1970, Math.min(currentYear, parseInt(e.target.value, 10) || currentYear));
                onYearChange(num);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;