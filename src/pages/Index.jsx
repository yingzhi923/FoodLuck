import React, { useState, useMemo, useCallback } from 'react';
import TopNav from '@/components/TopNav';
import MapView from '@/components/MapView';
import BottomSheet from '@/components/BottomSheet';
import RestaurantCard from '@/components/RestaurantCard';
import FortuneModal from '@/components/fortune/FortuneModal';
import WishPanel from '@/components/wish/WishPanel';
import restaurants from '@/data/restaurants';
import { sortByDistance, filterRestaurants } from '@/utils/filter';

export default function Index() {
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('nearby');
  const [fortuneOpen, setFortuneOpen] = useState(false);
  const [wishFilters, setWishFilters] = useState({});

  const nearbyRestaurants = useMemo(() => sortByDistance(restaurants), []);

  const wishResults = useMemo(() => {
    const hasFilters = Object.values(wishFilters).some(v =>
      v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0)
    );
    if (!hasFilters) return [];
    return filterRestaurants(restaurants, wishFilters).slice(0, 5);
  }, [wishFilters]);

  const highlightIds = useMemo(() => {
    if (activeTab === 'wish' && wishResults.length > 0) {
      return wishResults.map(r => r.id);
    }
    return [];
  }, [activeTab, wishResults]);

  const handleMarkerClick = useCallback((id) => {
    setSelectedId(id);
    const el = document.getElementById(`card-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  const handleCardSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <TopNav onFortuneClick={() => setFortuneOpen(true)} />

      <MapView
        restaurants={restaurants}
        selectedId={selectedId}
        highlightIds={highlightIds}
        onMarkerClick={handleMarkerClick}
        className="absolute top-12 left-0 right-0 bottom-0 z-0"
      />

      <BottomSheet>
        <div className="flex gap-1 mb-3 sticky top-0 bg-background pt-1 pb-2 z-10">
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'nearby'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            附近推荐
          </button>
          <button
            onClick={() => setActiveTab('wish')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'wish'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            ✨ 许愿
          </button>
        </div>

        {activeTab === 'nearby' && (
          <div className="space-y-3 pb-8">
            <p className="text-xs text-muted-foreground">
              30秒，决定你的下一顿 · 共{nearbyRestaurants.length}家
            </p>
            {nearbyRestaurants.map(r => (
              <div key={r.id} id={`card-${r.id}`}>
                <RestaurantCard
                  restaurant={r}
                  compact
                  onSelect={handleCardSelect}
                  className={selectedId === r.id ? 'ring-2 ring-primary/40' : ''}
                  showRouteButton
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wish' && (
          <WishPanel
            onSelectRestaurant={handleCardSelect}
            selectedId={selectedId}
          />
        )}
      </BottomSheet>

      <FortuneModal open={fortuneOpen} onClose={() => setFortuneOpen(false)} />
    </div>
  );
}
