import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Flame } from 'lucide-react';
import TopNav from '@/components/TopNav';
import MapView from '@/components/MapView';
import BottomSheet from '@/components/BottomSheet';
import FortuneModal from '@/components/fortune/FortuneModal';
import restaurants from '@/data/restaurants';
import { getHomepageMapRestaurants } from '@/utils/getHomepageMapRestaurants';
import { cn } from '@/lib/utils';
import { CUISINE_GRADIENTS } from '@/data/constants';

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

export default function Index() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [fortuneOpen, setFortuneOpen] = useState(false);

  const hotRestaurants = useMemo(
    () => restaurants.filter(r => r.isHot).sort((a, b) => a.hotRank - b.hotRank),
    []
  );

  const homepageMapRestaurants = useMemo(
    () => getHomepageMapRestaurants(restaurants),
    []
  );

  const handleMarkerClick = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <TopNav onFortuneClick={() => setFortuneOpen(true)} />

      <MapView
        restaurants={homepageMapRestaurants}
        selectedId={selectedId}
        highlightIds={[]}
        onMarkerClick={handleMarkerClick}
        className="absolute top-12 left-0 right-0 bottom-0 z-0 map-below-nav"
      />

      <BottomSheet>
        <div className="pb-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Flame className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-sm">附近热榜</h3>
            <span className="text-xs text-muted-foreground ml-1">· 大家都在吃</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {hotRestaurants.map((r) => {
              const gradient = CUISINE_GRADIENTS[r.cuisine] || CUISINE_GRADIENTS.default;
              return (
                <div
                  key={r.id}
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                  className={cn(
                    'rounded-xl bg-card border border-border/50 overflow-hidden cursor-pointer',
                    'hover:shadow-md hover:border-primary/30 active:scale-[0.98] transition-all'
                  )}
                >
                  <div className={cn('h-16 bg-gradient-to-br flex items-center justify-center relative', gradient)}>
                    <span className="text-2xl opacity-80">{getCuisineEmoji(r.cuisine)}</span>
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                      <Flame className="w-2.5 h-2.5" />
                      TOP{r.hotRank}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h4 className="font-bold text-sm truncate">{r.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>¥{r.avgPrice}/人</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />{r.walkingMinutes}分钟
                      </span>
                    </div>
                    <div className="flex gap-1 mt-1.5 overflow-hidden">
                      {r.studentTags.slice(0, 1).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BottomSheet>

      <FortuneModal open={fortuneOpen} onClose={() => setFortuneOpen(false)} />
    </div>
  );
}
