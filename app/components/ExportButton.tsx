import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { AppState } from '../types';

interface ExportButtonProps {
  data: AppState;
}

export const ExportButton = ({ data }: ExportButtonProps) => {
  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `productivity-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    // Convert tasks to CSV format
    const rows: string[] = ['Date,Task Title,Category,Priority,Completed,Estimate (min)'];
    
    Object.values(data.days).forEach(day => {
      day.tasks.forEach(task => {
        rows.push(
          `"${day.date}","${task.title}","${task.category}","${task.priority}",${task.completed},${task.estimate}`
        );
      });
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `productivity-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={exportToJSON}
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FileJson size={18} />
        <span className="hidden sm:inline">JSON</span>
      </Button>
      <Button 
        onClick={exportToCSV}
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FileSpreadsheet size={18} />
        <span className="hidden sm:inline">CSV</span>
      </Button>
    </div>
  );
};
