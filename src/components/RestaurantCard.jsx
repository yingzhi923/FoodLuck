import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Navigation, Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CUISINE_GRADIENTS, CAMPUS_CENTER } from '@/data/constants';
import { useAMap } from '@/contexts/AMapContext';

export default function RestaurantCard({ restaurant, compact = false, onSelect, className, showRouteButton = false }) {
  const navigate = useNavigate();
  const r = restaurant;
  const gradient = CUISINE_GRADIENTS[r.cuisine] || CUISINE_GRADIENTS.default;
  const { drawWalkingRoute } = useAMap() || {};
  const [routeLoading, setRouteLoading] = useState(false);

  const handleClick = () => {
    onSelect?.(r.id);
  };

  const handleDetail = (e) => {
    e.stopPropagation();
    navigate(`/restaurant/${r.id}`);
  };

  const handleNav = (e) => {
    e.stopPropagation();
    const url = `https://www.openstreetmap.org/?mlat=${r.coordinates.lat}&mlon=${r.coordinates.lng}&zoom=17`;
    window.open(url, '_blank');
  };

  const handleShowRoute = (e) => {
    e.stopPropagation();
    if (!drawWalkingRoute) return;
    setRouteLoading(true);
    drawWalkingRoute(CAMPUS_CENTER, r.coordinates)
      .then(() => {})
      .catch(() => {})
      .finally(() => setRouteLoading(false));
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'flex gap-3 p-3 rounded-xl bg-card border border-border/50 cursor-pointer',
          'hover:shadow-md hover:border-primary/30 active:scale-[0.99] transition-all',
          className
        )}
      >
        <div className={cn('w-16 h-16 rounded-lg bg-gradient-to-br flex-shrink-0 flex items-center justify-center', gradient)}>
          <span className="text-white text-xl">{getCuisineEmoji(r.cuisine)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm truncate">{r.name}</h4>
            <span className="text-xs text-muted-foreground shrink-0">¥{r.avgPrice}/人</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <span>{r.cuisine}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />{r.walkingMinutes}分钟
            </span>
          </div>
          <div className="flex gap-1 mt-1.5 overflow-hidden">
            {r.studentTags.slice(0, 2).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
          {showRouteButton && drawWalkingRoute && (
            <button
              type="button"
              onClick={handleShowRoute}
              disabled={routeLoading}
              className="mt-1.5 flex items-center gap-1 text-[10px] text-primary font-medium"
            >
              <Route className="w-3 h-3" />
              {routeLoading ? '路线中…' : '显示路线'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'rounded-2xl bg-card border border-border/50 overflow-hidden cursor-pointer',
        'hover:shadow-lg hover:border-primary/30 active:scale-[0.99] transition-all',
        className
      )}
    >
      <div className={cn('h-32 bg-gradient-to-br flex items-center justify-center relative', gradient)}>
        <span className="text-4xl opacity-80">{getCuisineEmoji(r.cuisine)}</span>
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 text-white text-xs font-medium backdrop-blur-sm">
          ¥{r.avgPrice}/人
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base leading-tight">{r.name}</h3>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
            <Clock className="w-3 h-3" />{r.walkingMinutes}min
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
          <span className="px-1.5 py-0.5 rounded bg-muted">{r.cuisine}</span>
          <span className="flex items-center gap-0.5">
            <MapPin className="w-3 h-3" />{r.distanceText}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {r.studentTags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[11px] bg-primary/10 text-primary font-medium">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-1">{r.recommendReason}</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDetail}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors"
          >
            查看详情
          </button>
          <button
            onClick={handleNav}
            className="flex items-center justify-center gap-1 flex-1 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Navigation className="w-3 h-3" />
            打开地图
          </button>
        </div>
      </div>
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
