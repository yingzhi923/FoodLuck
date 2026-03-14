import React, { useMemo, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { CAMPUS_CENTER } from '@/data/constants';
import { useAMap } from '@/contexts/AMapContext';

const MAP_BOUNDS = {
  lngMin: 121.212,
  lngMax: 121.228,
  latMin: 31.033,
  latMax: 31.043,
};

function coordToPercent(lng, lat) {
  const x = ((lng - MAP_BOUNDS.lngMin) / (MAP_BOUNDS.lngMax - MAP_BOUNDS.lngMin)) * 100;
  const y = (1 - (lat - MAP_BOUNDS.latMin) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * 100;
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

/*
 * ===== 高德地图接入说明 =====
 *
 * 1. 在 index.html 的 <head> 中加入：
 *    <script src="https://webapi.amap.com/maps?v=2.0&key=你的KEY&plugin=AMap.Walking"></script>
 *
 * 2. 在 .env 中设置（可选）：
 *    VITE_AMAP_KEY=你的KEY
 *
 * 3. 本组件会自动检测 window.AMap 是否存在：
 *    - 存在 → 使用真实高德地图
 *    - 不存在 → 使用占位地图（当前模式）
 */

export default function MapView({
  restaurants = [],
  selectedId,
  highlightIds,
  onMarkerClick,
  className,
}) {
  const mapContainerRef = useRef(null);
  const amapRef = useRef(null);
  const markersRef = useRef([]);
  const [useAmap, setUseAmap] = useState(false);
  const { setMap, clearRoute } = useAMap() || {};

  // Check if AMap SDK is loaded
  useEffect(() => {
    if (window.AMap) {
      setUseAmap(true);
    }
  }, []);

  // Initialize AMap if available
  useEffect(() => {
    if (!useAmap || !mapContainerRef.current || amapRef.current) return;

    const map = new window.AMap.Map(mapContainerRef.current, {
      zoom: 15,
      center: [CAMPUS_CENTER.lng, CAMPUS_CENTER.lat],
      mapStyle: 'amap://styles/fresh',
    });
    amapRef.current = map;
    setMap?.(map);

    return () => {
      clearRoute?.();
      map.destroy();
      amapRef.current = null;
      setMap?.(null);
    };
  }, [useAmap, setMap, clearRoute]);

  // Update AMap markers (with optional cluster when many points)
  useEffect(() => {
    if (!useAmap || !amapRef.current) return;
    const map = amapRef.current;
    const highlightSet = new Set(highlightIds || []);

    // Clear old markers or cluster
    markersRef.current.forEach(m => map.remove(m));
    markersRef.current = [];

    const markerList = restaurants.map(r => {
      const isSelected = r.id === selectedId;
      const isHighlighted = highlightSet.has(r.id);
      const size = isSelected ? 32 : isHighlighted ? 24 : 16;
      const marker = new window.AMap.Marker({
        position: [r.coordinates.lng, r.coordinates.lat],
        title: r.name,
        extData: { id: r.id },
        offset: new window.AMap.Pixel(-size / 2, -size / 2),
        content: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${isSelected ? '#F97316' : isHighlighted ? '#FB923C' : '#FDBA74'};display:flex;align-items:center;justify-content:center;color:white;font-size:${isSelected ? 12 : 8}px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2);cursor:pointer;transition:all 0.2s">${isSelected || isHighlighted ? r.name.slice(0, 1) : ''}</div>`,
      });
      marker.on('click', () => onMarkerClick?.(r.id));
      if (isSelected) map.setCenter([r.coordinates.lng, r.coordinates.lat]);
      return marker;
    });

    if (restaurants.length > 25) {
      window.AMap.plugin(['AMap.MarkerCluster'], () => {
        const cluster = new window.AMap.MarkerCluster(map, markerList, { gridSize: 60 });
        markersRef.current = [cluster];
      });
    } else {
      markerList.forEach(m => {
        map.add(m);
        markersRef.current.push(m);
      });
    }
  }, [useAmap, restaurants, selectedId, highlightIds, onMarkerClick]);

  // === AMap mode ===
  if (useAmap) {
    return (
      <div
        ref={mapContainerRef}
        id="map-container"
        className={cn('relative w-full', className)}
      />
    );
  }

  // === Placeholder mode ===
  return <PlaceholderMap
    restaurants={restaurants}
    selectedId={selectedId}
    highlightIds={highlightIds}
    onMarkerClick={onMarkerClick}
    className={className}
  />;
}

function PlaceholderMap({ restaurants, selectedId, highlightIds, onMarkerClick, className }) {
  const markers = useMemo(() =>
    restaurants.map(r => ({
      ...r,
      pos: coordToPercent(r.coordinates.lng, r.coordinates.lat),
    })),
    [restaurants]
  );

  const highlightSet = useMemo(
    () => new Set(highlightIds || []),
    [highlightIds]
  );

  const center = coordToPercent(CAMPUS_CENTER.lng, CAMPUS_CENTER.lat);

  return (
    <div
      id="map-container"
      className={cn(
        'relative w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden',
        className
      )}
    >
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-amber-700" />
          </pattern>
          <pattern id="roads" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="60" y1="0" x2="60" y2="120" stroke="currentColor" strokeWidth="2" className="text-amber-800" />
            <line x1="0" y1="60" x2="120" y2="60" stroke="currentColor" strokeWidth="2" className="text-amber-800" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#roads)" />
      </svg>

      <div
        className="absolute w-20 h-20 rounded-full bg-primary/5 border border-primary/10"
        style={{ left: `${center.x}%`, top: `${center.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-primary/40 font-medium">大学城</span>
        </div>
      </div>

      {markers.map(r => {
        const isSelected = r.id === selectedId;
        const isHighlighted = highlightSet.has(r.id);
        return (
          <button
            key={r.id}
            onClick={() => onMarkerClick?.(r.id)}
            className={cn(
              'absolute transition-all duration-200 -translate-x-1/2 -translate-y-1/2',
              'rounded-full flex items-center justify-center',
              isSelected
                ? 'w-8 h-8 bg-primary text-white shadow-lg z-30 scale-110 ring-2 ring-primary/30'
                : isHighlighted
                  ? 'w-6 h-6 bg-primary text-white shadow-md z-20'
                  : 'w-4 h-4 bg-orange-400/80 text-white shadow z-10 hover:scale-125 hover:bg-primary'
            )}
            style={{ left: `${r.pos.x}%`, top: `${r.pos.y}%` }}
            title={r.name}
          >
            {(isSelected || isHighlighted) && (
              <span className="text-[8px] font-bold">
                {r.name.slice(0, 1)}
              </span>
            )}
            {isSelected && (
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-foreground text-white text-[10px] font-medium">
                {r.name}
              </div>
            )}
          </button>
        );
      })}

      <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground/40">
        占位地图 · 高德地图接入中
      </div>
    </div>
  );
}
