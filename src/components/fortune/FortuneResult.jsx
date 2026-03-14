import React from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CUISINE_GRADIENTS } from '@/data/constants';

export default function FortuneResult({ restaurant, fortune, onReshake }) {
  const r = restaurant;
  const gradient = CUISINE_GRADIENTS[r.cuisine] || CUISINE_GRADIENTS.default;

  return (
    <div className="space-y-4">
      {/* Fortune level */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.1 }}
        className="text-center"
      >
        <p className="text-4xl mb-1">{fortune.emoji}</p>
        <h3 className={cn('text-2xl font-black', fortune.color)}>{fortune.level}</h3>
        <p className="text-sm text-muted-foreground mt-1">{fortune.message}</p>
      </motion.div>

      {/* Result: restaurant name + brief info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn('rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-gradient-to-br flex items-center justify-center gap-3 p-4', gradient)}
      >
        <span className="text-4xl opacity-80">{getCuisineEmoji(r.cuisine)}</span>
        <div className="text-left min-w-0">
          <h4 className="font-bold text-lg text-white drop-shadow-sm">{r.name}</h4>
          <p className="text-sm text-white/90 mt-0.5">¥{r.avgPrice}/人 · 步行{r.walkingMinutes}分钟</p>
        </div>
      </motion.div>

      {/* Re-shake only */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={onReshake}
          className="w-full py-3 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          重新摇签
        </button>
      </motion.div>
    </div>
  );
}

function getCuisineEmoji(cuisine) {
  const map = {
    '中餐': '🍚', '面食': '🍜', '日料': '🍣', '韩餐': '🍱',
    '泰餐': '🍛', '西式': '🍔', '快餐': '🍟', '烧烤': '🔥',
    '麻辣烫': '🌶️', '火锅': '🍲', '串串': '🍢', '奶茶甜品': '🧋',
    '咖啡': '☕', '轻食': '🥗', '台式': '🍱', '港式': '🫖',
    '东北菜': '🥟', '川菜': '🌶️', '湘菜': '🌶️', '新疆菜': '🍖',
    '小龙虾': '🦞', '甜品': '🍰', '面包': '🥐',
  };
  return map[cuisine] || '🍽️';
}
