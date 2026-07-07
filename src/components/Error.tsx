/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorProps> = ({
  title = 'An error occurred',
  message,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`border border-red-200 bg-red-50/40 rounded-2xl p-6 text-left flex flex-col sm:flex-row items-start gap-4 max-w-2xl mx-auto ${className}`}>
      <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-3 flex-1">
        <div>
          <h4 className="text-xs font-bold text-red-950 uppercase tracking-wider font-mono">
            {title}
          </h4>
          <p className="text-xs text-red-800 leading-relaxed font-medium mt-1">
            {message}
          </p>
        </div>
        {onRetry && (
          <Button variant="danger" size="sm" onClick={onRetry}>
            Retry Action
          </Button>
        )}
      </div>
    </div>
  );
};
