/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, leftIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full bg-slate-50 border ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
          } rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white transition-all duration-200 ${
            leftIcon ? 'pl-10' : ''
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required,
  children,
  className = '',
  htmlFor
}) => {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      <label 
        htmlFor={htmlFor}
        className="text-xs font-bold text-slate-700 tracking-wide flex items-center gap-0.5 cursor-pointer"
      >
        <span>{label}</span>
        {required && <span className="text-red-500 font-bold" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[10px] font-bold text-red-500 font-sans tracking-wide mt-1" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[10px] text-slate-400 font-medium font-sans tracking-wide mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full bg-slate-50 border ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
        } rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white transition-all duration-200 cursor-pointer ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full bg-slate-50 border ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
        } rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:bg-white transition-all duration-200 min-h-[100px] resize-y ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
