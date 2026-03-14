import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import FilterChips from '@/components/FilterChips';
import { BUDGET_OPTIONS, WALKING_OPTIONS, PEOPLE_OPTIONS, EXCLUDE_OPTIONS } from '@/data/constants';

const CATEGORY_OPTIONS = ['正餐', '小吃', '甜品', '夜宵'];

export default function ConditionSelect({ onSubmit, onQuickStart }) {
  const [budget, setBudget] = useState(null);
  const [walkingTime, setWalkingTime] = useState(null);
  const [category, setCategory] = useState(null);
  const [people, setPeople] = useState(null);
  const [excludes, setExcludes] = useState([]);

  const handleSubmit = () => {
    onSubmit({
      budget,
      walkingTime,
      category,
      people,
      excludes,
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick start CTA */}
      {onQuickStart && (
        <button
          onClick={onQuickStart}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-orange-400 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          直接开始抽签
        </button>
      )}

      {onQuickStart && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">或者先筛选一下</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}

      <p className="text-sm text-muted-foreground">选几个条件，剩下的交给食运 ✨</p>

      <FilterChips
        label="预算"
        options={BUDGET_OPTIONS}
        value={budget}
        onChange={setBudget}
      />

      <FilterChips
        label="步行范围"
        options={WALKING_OPTIONS}
        value={walkingTime}
        onChange={setWalkingTime}
      />

      <FilterChips
        label="类型"
        options={CATEGORY_OPTIONS}
        value={category}
        onChange={setCategory}
      />

      <FilterChips
        label="人数"
        options={PEOPLE_OPTIONS}
        value={people}
        onChange={setPeople}
      />

      <FilterChips
        label="不想吃"
        options={EXCLUDE_OPTIONS}
        value={excludes}
        onChange={setExcludes}
        multiple
      />

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
      >
        生成候选签 →
      </button>
    </div>
  );
}
