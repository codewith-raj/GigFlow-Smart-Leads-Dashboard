import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface QueryErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const QueryErrorState: React.FC<QueryErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We could not load this data. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-red-500/20 bg-red-500/5">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  );
};

export default QueryErrorState;
