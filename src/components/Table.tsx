/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  className = ''
}) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-200/60 shadow-xs ${className}`}>
      <table className="min-w-full divide-y divide-slate-100 text-left">
        <thead className="bg-slate-50/70">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-4.5 text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <tr className={`hover:bg-slate-50/40 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <td className={`px-6 py-4.5 text-xs font-sans text-slate-700 leading-normal ${className}`} {...props}>
      {children}
    </td>
  );
};
