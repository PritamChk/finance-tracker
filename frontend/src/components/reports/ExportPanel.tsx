import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import type { ReportFormat, ReportQueryParams } from '@/types/reports.types';

interface ExportPanelProps {
  onExport: (params: ReportQueryParams) => void;
  isExporting: boolean;
}

const formatLabels: Record<ReportFormat, { label: string; icon: React.ReactNode }> = {
  csv: { label: 'CSV', icon: <FileSpreadsheet size={16} /> },
  pdf: { label: 'PDF', icon: <FileText size={16} /> },
};

const ExportPanel: React.FC<ExportPanelProps> = ({ onExport, isExporting }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [format, setFormat] = useState<ReportFormat>('csv');

  const handleExport = () => {
    const params: ReportQueryParams = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    params.format = format;
    onExport(params);
  };

  return (
    <div className="card export-panel">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Export Data</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Download transaction data</p>

      <div className="export-filters space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="label label-sm">Start</label>
            <input
              type="date"
              className="input input-sm w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="label label-sm">End</label>
            <input
              type="date"
              className="input input-sm w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label label-sm">Format</label>
          <select
            className="input input-sm w-full"
            value={format}
            onChange={(e) => setFormat(e.target.value as ReportFormat)}
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
      </div>

      <button
        className="btn btn-primary btn-sm w-full mt-3"
        onClick={handleExport}
        disabled={isExporting}
      >
        <Download size={14} />
        {isExporting ? 'Exporting...' : `Download ${formatLabels[format].label}`}
      </button>
    </div>
  );
};

export default ExportPanel;