import React, { useMemo, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { cn } from '@/lib/utils';
import { CAMPUS_CENTER } from '@/data/constants';
import { useAMap } from '@/contexts/AMapContext';

// 松江大学城范围，约 5km 视野
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

function toLeafletLatLng(coords) {
  return [coords.lat, coords.lng];
}

export default function MapView({
  restaurants = [],
  selectedId,
  highlightIds,
  onMarkerClick,
  className,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const { setMap, clearRoute } = useAMap() || {};
  const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;
  const useRealMap = Boolean(maptilerKey);

  // Initialize Leaflet map once when container is ready and key exists
  useEffect(() => {
    if (!maptilerKey || !mapContainerRef.current || mapRef.current) return;

    const center = toLeafletLatLng(CAMPUS_CENTER);
    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 15,
    });

    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${maptilerKey}`,
      {
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        crossOrigin: true,
      }
    ).addTo(map);

    mapRef.current = map;
    setMap?.(map);

    return () => {
      clearRoute?.();
      map.remove();
      mapRef.current = null;
      setMap?.(null);
    };
  }, [maptilerKey]);

  // Update markers when restaurants, selectedId, highlightIds change
  useEffect(() => {
    if (!useRealMap || !mapRef.current) return;
    const map = mapRef.current;

    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
      markersLayerRef.current = null;
    }

    const highlightSet = new Set(highlightIds || []);

    const layerGroup = L.layerGroup();
    restaurants.forEach((r) => {
      const isSelected = r.id === selectedId;
      const isHighlighted = highlightSet.has(r.id);
      const size = isSelected ? 32 : isHighlighted ? 24 : 16;
      const bg = isSelected ? '#F97316' : isHighlighted ? '#FB923C' : '#FDBA74';
      const icon = L.divIcon({
        className: 'leaflet-marker-div',
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;color:white;font-size:${isSelected ? 12 : 8}px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2);cursor:pointer;transition:all 0.2s;border:none;pointer-events:auto">${isSelected || isHighlighted ? r.name.slice(0, 1) : ''}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker(toLeafletLatLng(r.coordinates), { icon })
        .on('click', () => onMarkerClick?.(r.id));

      const popupContent = `<div class="text-sm"><strong>${r.name}</strong><br/>¥${r.avgPrice}/人 · ${r.walkingMinutes}分钟</div>`;
      marker.bindPopup(popupContent);
      layerGroup.addLayer(marker);
    });

    layerGroup.addTo(map);
    markersLayerRef.current = layerGroup;

    if (selectedId) {
      const selected = restaurants.find((r) => r.id === selectedId);
      if (selected) {
        map.flyTo(toLeafletLatLng(selected.coordinates), 16, { duration: 0.3 });
      }
    }

    if (highlightIds?.length > 0) {
      const highlighted = restaurants.filter((r) => highlightSet.has(r.id));
      if (highlighted.length > 0) {
        const bounds = L.latLngBounds(highlighted.map((r) => toLeafletLatLng(r.coordinates)));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    }
  }, [useRealMap, restaurants, selectedId, highlightIds, onMarkerClick]);

  if (useRealMap) {
    return (
      <div
        ref={mapContainerRef}
        id="map-container"
        className={cn('relative w-full h-full', className)}
      />
    );
  }

  return (
    <PlaceholderMap
      restaurants={restaurants}
      selectedId={selectedId}
      highlightIds={highlightIds}
      onMarkerClick={onMarkerClick}
      className={className}
    />
  );
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
        占位地图 · 配置 VITE_MAPTILER_KEY 显示地图
      </div>
    </div>
  );
}
