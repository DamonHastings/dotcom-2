import React from 'react';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  id?: string;
};

export default function Textarea({ label, id, className = '', ...props }: Props) {
  const inputId = id ?? `textarea-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mb-1 text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className="border rounded-md px-3 py-2 min-h-[120px] bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...props}
      />
    </div>
  );
}
