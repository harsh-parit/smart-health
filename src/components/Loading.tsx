/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading dashboard environment...',
  fullPage = false
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin absolute" />
        <span className="w-4 h-4 rounded-full bg-blue-500/20 animate-ping" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-700 font-sans tracking-wide">
          {message}
        </p>
        <p className="text-[10px] text-slate-400 font-mono mt-1.5 uppercase tracking-widest animate-pulse">
          Secure Cloud Syncing
        </p>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
  );
};
