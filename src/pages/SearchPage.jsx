import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, Clock } from 'lucide-react';
import RestaurantCard from '@/components/RestaurantCard';
import restaurants from '@/data/restaurants';
import { loadAMapPlugins } from '@/lib/amapLoader';

const HOT_SEARCHES = ['麻辣烫', '奶茶', '拉面', '烧烤', '火锅', '咖啡', '炸鸡', '日料'];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const autoCompleteListenerRef = useRef(null);
  const [recentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recent_searches') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    if (!window.AMap || !inputRef.current) return;
    let cancelled = false;
    loadAMapPlugins(['AMap.AutoComplete'])
      .then(() => {
        if (cancelled || !inputRef.current) return;
        const auto = new window.AMap.AutoComplete({ input: 'search-page-input', city: '上海' });
        autoCompleteRef.current = auto;
        const onSelect = (e) => {
          if (e.poi?.name) setQuery(e.poi.name);
        };
        window.AMap.event.addListener(auto, 'select', onSelect);
        autoCompleteListenerRef.current = { auto, onSelect };
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      const listener = autoCompleteListenerRef.current;
      if (listener) {
        window.AMap.event.removeListener(listener.auto, 'select', listener.onSelect);
      }
      autoCompleteListenerRef.current = null;
      autoCompleteRef.current = null;
    };
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.studentTags.some(t => t.includes(q)) ||
      r.category.some(c => c.includes(q)) ||
      r.recommendedDishes.some(d => d.includes(q))
    );
  }, [query]);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim()) {
      try {
        const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
        const updated = [text, ...recent.filter(s => s !== text)].slice(0, 8);
        localStorage.setItem('recent_searches', JSON.stringify(updated));
      } catch { /* noop */ }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="shrink-0">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border relative">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              id="search-page-input"
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="搜索餐厅、菜系、标签..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {!query.trim() ? (
          <div className="space-y-6">
            {/* Hot searches */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">热门搜索</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {HOT_SEARCHES.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">最近搜索</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSearch(s)}
                      className="px-3 py-1.5 rounded-full text-sm bg-muted/50 border border-border hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">找到 {results.length} 个结果</p>
            {results.map(r => (
              <RestaurantCard key={r.id} restaurant={r} compact />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-muted-foreground">没有找到"{query}"相关的餐厅</p>
            <p className="text-xs text-muted-foreground mt-1">试试其他关键词？</p>
          </div>
        )}
      </div>
    </div>
  );
}
