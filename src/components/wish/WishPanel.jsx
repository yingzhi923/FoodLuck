import React, { useState, useMemo } from 'react';
import WishFilters from './WishFilters';
import WishResults from './WishResults';
import restaurants from '@/data/restaurants';
import { filterRestaurants } from '@/utils/filter';

export default function WishPanel({ onSelectRestaurant, selectedId }) {
  const [filters, setFilters] = useState({});

  const hasFilters = Object.values(filters).some(v =>
    v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0)
  );

  const results = useMemo(() => {
    if (!hasFilters) return [];
    const filtered = filterRestaurants(restaurants, filters);
    return filtered.slice(0, 5);
  }, [filters, hasFilters]);

  const highlightIds = useMemo(() => results.map(r => r.id), [results]);

  return (
    <div className="space-y-4 pb-8">
      <p className="text-sm text-muted-foreground">说说你想吃什么，我来帮你找 ✨</p>

      <WishFilters filters={filters} onChange={setFilters} />

      <WishResults
        results={results}
        hasFilters={hasFilters}
        onSelect={onSelectRestaurant}
        selectedId={selectedId}
      />
    </div>
  );
}

WishPanel.getHighlightIds = () => [];
