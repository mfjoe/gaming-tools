import React from 'react';
import { FilterSection } from '../FilterPanel';
import { CardType } from '../../types/player';

const CARD_TYPES: CardType[] = ['base', 'rare', 'icon', 'hero', 'totw', 'toty', 'promo'];

interface CardTypeFilterProps {
  value: CardType[];
  onChange: (cardTypes: CardType[]) => void;
}

export const CardTypeFilter: React.FC<CardTypeFilterProps> = ({
  value,
  onChange,
}) => {
  const handleToggle = (cardType: CardType) => {
    if (value.includes(cardType)) {
      onChange(value.filter((type) => type !== cardType));
    } else {
      onChange([...value, cardType]);
    }
  };

  return (
    <FilterSection title="Card Type">
      <div className="flex flex-wrap gap-2">
        {CARD_TYPES.map((type) => (
          <label
            key={type}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value.includes(type)}
              onChange={() => handleToggle(type)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
              {type}
            </span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
};


