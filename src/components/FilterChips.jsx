import React from 'react';
import { cn } from '@/lib/utils';

export default function FilterChips({
  options,
  value,
  onChange,
  multiple = false,
  label,
  className,
}) {
  const handleClick = (optionValue) => {
    if (multiple) {
      const current = value || [];
      const next = current.includes(optionValue)
        ? current.filter(v => v !== optionValue)
        : [...current, optionValue];
      onChange(next);
    } else {
      onChange(value === optionValue ? null : optionValue);
    }
  };

  const isSelected = (optionValue) => {
    if (multiple) return (value || []).includes(optionValue);
    return value === optionValue;
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          const selected = isSelected(optValue);
          return (
            <button
              key={optValue}
              onClick={() => handleClick(optValue)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                'border hover:shadow-sm active:scale-95',
                selected
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background text-foreground border-border hover:border-primary/50'
              )}
            >
              {optLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
