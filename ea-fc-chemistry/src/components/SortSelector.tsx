import React from 'react';
import { SortOption } from '../types/player';

interface SortSelectorProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'rating-desc', label: 'Rating (High→Low)' },
  { value: 'rating-asc', label: 'Rating (Low→High)' },
  { value: 'price-asc', label: 'Price (Low→High)' },
  { value: 'price-desc', label: 'Price (High→Low)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'pace-desc', label: 'Pace (High→Low)' },
  { value: 'shooting-desc', label: 'Shooting (High→Low)' },
  { value: 'passing-desc', label: 'Passing (High→Low)' },
];

export const SortSelector: React.FC<SortSelectorProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
      aria-label="Sort by"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};


