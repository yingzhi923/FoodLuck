import React from 'react';
import FilterChips from '@/components/FilterChips';
import { BUDGET_OPTIONS, WALKING_OPTIONS, PEOPLE_OPTIONS, CUISINES, SCENARIOS } from '@/data/constants';

export default function WishFilters({ filters, onChange }) {
  const update = (key, value) => {
    onChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-3">
      <FilterChips
        label="用餐人数"
        options={PEOPLE_OPTIONS}
        value={filters.people}
        onChange={v => update('people', v)}
      />

      <FilterChips
        label="场景"
        options={SCENARIOS}
        value={filters.scenario}
        onChange={v => update('scenario', v)}
      />

      <FilterChips
        label="人均预算"
        options={BUDGET_OPTIONS}
        value={filters.budget}
        onChange={v => update('budget', v)}
      />

      <FilterChips
        label="步行距离"
        options={WALKING_OPTIONS}
        value={filters.walkingTime}
        onChange={v => update('walkingTime', v)}
      />

      <FilterChips
        label="菜系"
        options={['中餐', '日料', '韩餐', '泰餐', '西式', '烧烤', '麻辣烫', '火锅', '奶茶甜品']}
        value={filters.cuisine}
        onChange={v => update('cuisine', v)}
      />

      {/* Supplementary text input */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-muted-foreground">补充说明（可选）</p>
        <input
          type="text"
          placeholder="想吃点热的、想安静一点..."
          value={filters.search || ''}
          onChange={e => update('search', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}
