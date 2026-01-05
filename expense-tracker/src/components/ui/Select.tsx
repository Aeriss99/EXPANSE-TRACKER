import React from 'react';
import { cn } from '@/lib/utils';
import { ExpenseCategory } from '@/types';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      >
        <option value="">Pilih kategori...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Kategori options untuk expense
export const expenseCategoryOptions = [
  { value: 'FOOD', label: 'Makanan' },
  { value: 'TRANSPORTATION', label: 'Transportasi' },
  { value: 'ENTERTAINMENT', label: 'Hiburan' },
  { value: 'BILLS', label: 'Tagihan' },
  { value: 'OTHERS', label: 'Lainnya' },
];
