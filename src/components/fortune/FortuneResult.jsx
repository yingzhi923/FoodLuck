import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, RefreshCw, Eye, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CUISINE_GRADIENTS } from '@/data/constants';

export default function FortuneResult({ restaurant, fortune, onReshake, onClose }) {
  const navigate = useNavigate();
  const r = restaurant;
  const gradient = CUISINE_GRADIENTS[r.cuisine] || CUISINE_GRADIENTS.default;

  const handleNav = () => {
    const url = `https://uri.amap.com/navigation?to=${r.coordinates.lng},${r.coordinates.lat},${encodeURIComponent(r.name)}&mode=walking&callnative=1`;
    window.open(url, '_blank');
  };

  const handleDetail = () => {
    onClose();
    navigate(`/restaurant/${r.id}`);
  };

  return (
    <div className="space-y-4">
      {/* Fortune level */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
        className="text-center"
      >
        <p className="text-4xl mb-1">{fortune.emoji}</p>
        <h3 className={cn('text-2xl font-black', fortune.color)}>{fortune.level}</h3>
        <p className="text-sm text-muted-foreground mt-1">{fortune.message}</p>
      </motion.div>

      {/* Result restaurant card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl overflow-hidden border border-border/50 shadow-sm"
      >
        <div className={cn('h-28 bg-gradient-to-br flex items-center justify-center relative', gradient)}>
          <span className="text-4xl opacity-70">{getCuisineEmoji(r.cuisine)}</span>
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 text-white text-xs font-medium backdrop-blur-sm">
            ¥{r.avgPrice}/人
          </div>
        </div>
        <div className="p-3 bg-card">
          <h4 className="font-bold text-base">{r.name}</h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="px-1.5 py-0.5 rounded bg-muted">{r.cuisine}</span>
            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{r.walkingMinutes}min</span>
            <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{r.distanceText}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {r.studentTags.slice(0, 3).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary font-medium">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{r.recommendReason}</p>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="space-y-2"
      >
        <div className="flex gap-2">
          <button
            onClick={handleNav}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Navigation className="w-4 h-4" />
            一键导航
          </button>
          <button
            onClick={handleDetail}
            className="py-3 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            详情
          </button>
        </div>
        <button
          onClick={onReshake}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          换一签
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
