import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FilterState, Player } from '../types/player';
import { PositionFilter } from './filters/PositionFilter';
import { RatingFilter } from './filters/RatingFilter';
import { PriceFilter } from './filters/PriceFilter';
import { NationalityFilter } from './filters/NationalityFilter';
import { LeagueFilter } from './filters/LeagueFilter';
import { ClubFilter } from './filters/ClubFilter';
import { CardTypeFilter } from './filters/CardTypeFilter';
import { AdditionalFilters } from './filters/AdditionalFilters';

interface FilterPanelProps {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: any) => void;
  players: Player[];
  currentPosition?: string | null;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilter,
  players,
  currentPosition,
}) => {
  return (
    <div className="p-4 space-y-4" data-filter-panel>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
      </div>

      <PositionFilter
        value={filters.positions}
        onChange={(positions) => setFilter('positions', positions)}
        currentPosition={currentPosition}
      />

      <RatingFilter
        minRating={filters.minRating}
        maxRating={filters.maxRating}
        onChange={(min, max) => {
          setFilter('minRating', min);
          setFilter('maxRating', max);
        }}
      />

      <PriceFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        platform={filters.platform}
        onChange={(min, max, platform) => {
          setFilter('minPrice', min);
          setFilter('maxPrice', max);
          setFilter('platform', platform);
        }}
      />

      <NationalityFilter
        value={filters.nationalities}
        onChange={(nationalities) => setFilter('nationalities', nationalities)}
        players={players}
      />

      <LeagueFilter
        value={filters.leagues}
        onChange={(leagues) => setFilter('leagues', leagues)}
        players={players}
      />

      <ClubFilter
        value={filters.clubs}
        onChange={(clubs) => setFilter('clubs', clubs)}
        players={players}
      />

      <CardTypeFilter
        value={filters.cardTypes}
        onChange={(cardTypes) => setFilter('cardTypes', cardTypes)}
      />

      <AdditionalFilters filters={filters} setFilter={setFilter} />
    </div>
  );
};

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="pt-2">{children}</div>}
    </div>
  );
};


