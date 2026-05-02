import { useState } from 'react';
import { Download } from 'lucide-react';
import { useExportTransactions, useReportPreview } from '@/hooks/useReports';
import type { ReportQueryParams } from '@/types/reports.types';

type Mode = 'range' | 'monthly' | 'yearly';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();

export function ReportsPage() {
  const [mode, setMode] = useState<Mode>('range');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [generated, setGenerated] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'csv' | 'pdf'>('csv');

  const [queryParams, setQueryParams] = useState<ReportQueryParams | undefined>(undefined);
  const previewQuery = useReportPreview(queryParams);

  const exportTransactions = useExportTransactions();

  const handleGenerate = () => {
    const params: ReportQueryParams = {};

    if (mode === 'range') {
      params.start_date = startDate;
      params.end_date = endDate;
    } else if (mode === 'monthly') {
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      params.start_date = start;
      params.end_date = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
    } else {
      params.start_date = `${year}-01-01`;
      params.end_date = `${year}-12-31`;
    }

    setQueryParams(params);
    setGenerated(true);
  };

  const handleDownload = () => {
    const params: ReportQueryParams = {
      format: downloadFormat,
    };

    if (mode === 'range') {
      params.start_date = startDate;
      params.end_date = endDate;
    } else if (mode === 'monthly') {
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      params.start_date = start;
      params.end_date = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
    } else {
      params.start_date = `${year}-01-01`;
      params.end_date = `${year}-12-31`;
    }

    exportTransactions.mutate(params);
  };

  return (
    <div className="w-full px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Select Period</h3>
            
            <div className="flex gap-1 mb-3">
              <button
                className={`btn btn-xs flex-1 ${mode === 'range' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setMode('range'); setGenerated(false); }}
              >
                Date Range
              </button>
              <button
                className={`btn btn-xs flex-1 ${mode === 'monthly' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setMode('monthly'); setGenerated(false); }}
              >
                Monthly
              </button>
              <button
                className={`btn btn-xs flex-1 ${mode === 'yearly' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setMode('yearly'); setGenerated(false); }}
              >
                Yearly
              </button>
            </div>

            {mode === 'range' && (
              <div className="space-y-2">
                <div>
                  <label className="label label-sm">From</label>
                  <input
                    type="date"
                    className="input input-sm w-full"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label label-sm">To</label>
                  <input
                    type="date"
                    className="input input-sm w-full"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {mode === 'monthly' && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="label label-sm">Month</label>
                  <select
                    className="input input-sm w-full"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                  >
                    {monthNames.map((m, idx) => (
                      <option key={idx} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="label label-sm">Year</label>
                  <input
                    type="number"
                    className="input input-sm w-full"
                    value={year}
                    min={1970}
                    max={currentYear}
                    onChange={(e) => setYear(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {mode === 'yearly' && (
              <div>
                <label className="label label-sm">Year</label>
                <input
                  type="number"
                  className="input input-sm w-full"
                  value={year}
                  min={1970}
                  max={currentYear}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>
            )}

            <button
              className="btn btn-primary btn-sm w-full mt-3"
              onClick={handleGenerate}
            >
              Generate Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {generated ? (
            <>
              <div className="card">
                <h3 className="card-title mb-3">Preview</h3>
                {previewQuery.isLoading ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading preview...</p>
                ) : previewQuery.isError ? (
                  <p className="text-sm text-red-500 dark:text-red-400">Failed to load preview</p>
                ) : previewQuery.data?.items.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found for this period</p>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewQuery.data?.items.map((row, idx) => (
                            <tr key={idx}>
                              <td>{row.date}</td>
                              <td>{row.category_name || 'Uncategorized'}</td>
                              <td>
                                <span className={`badge ${row.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                                  {row.type}
                                </span>
                              </td>
                              <td>₹{(row.amount || 0).toLocaleString('en-IN')}</td>
                              <td>{row.description || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Showing {previewQuery.data?.items.length} of {previewQuery.data?.total || 0} transactions
                    </p>
                  </>
                )}
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Download Report</h3>
                <div className="flex gap-2">
                  <select
                    className="input input-sm"
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value as 'csv' | 'pdf')}
                  >
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                  </select>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleDownload}
                    disabled={exportTransactions.isPending}
                  >
                    <Download size={14} />
                    {exportTransactions.isPending ? 'Downloading...' : 'Download'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="card">
              <h3 className="card-title">Transaction Reports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a time period and click "Generate Report" to preview your data before downloading.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;