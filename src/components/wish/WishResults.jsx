import React from 'react';
import RestaurantCard from '@/components/RestaurantCard';

export default function WishResults({ results, hasFilters, onSelect, selectedId }) {
  if (!hasFilters) {
    return (
      <div className="py-8 text-center">
        <p className="text-3xl mb-2">🔮</p>
        <p className="text-sm text-muted-foreground">选择你的条件</p>
        <p className="text-xs text-muted-foreground mt-1">我会帮你找到最合适的餐厅</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-3xl mb-2">😅</p>
        <p className="text-sm text-muted-foreground">没找到完全匹配的餐厅</p>
        <p className="text-xs text-muted-foreground mt-1">试试放宽一些条件？</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        为你找到 {results.length} 家推荐 ✨
      </p>
      {results.map(r => (
        <RestaurantCard
          key={r.id}
          restaurant={r}
          compact
          onSelect={onSelect}
          className={selectedId === r.id ? 'ring-2 ring-primary/40' : ''}
          showRouteButton
        />
      ))}
    </div>
  );
}
