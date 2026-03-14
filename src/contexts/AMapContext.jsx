import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import L from 'leaflet';

const AMapContext = createContext(null);

function toLeafletLatLng(point) {
  if (Array.isArray(point)) {
    return point.length >= 2 ? [point[1], point[0]] : null;
  }
  return point && typeof point.lat === 'number' && typeof point.lng === 'number'
    ? [point.lat, point.lng]
    : null;
}

export function AMapProvider({ children }) {
  const [map, setMap] = useState(null);
  const routePolylineRef = useRef(null);

  const clearRoute = useCallback(() => {
    if (!map) return;
    if (routePolylineRef.current) {
      try {
        map.removeLayer(routePolylineRef.current);
      } catch (_) {}
      routePolylineRef.current = null;
    }
  }, [map]);

  const drawWalkingRoute = useCallback((origin, dest) => {
    if (!map) return Promise.reject(new Error('Map not ready'));
    const start = toLeafletLatLng(origin);
    const end = toLeafletLatLng(dest);
    if (!start || !end) return Promise.reject(new Error('Invalid coordinates'));

    clearRoute();
    const latlngs = [start, end];
    const polyline = L.polyline(latlngs, {
      color: '#F97316',
      weight: 6,
      opacity: 0.9,
    });
    polyline.addTo(map);
    routePolylineRef.current = polyline;
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    return Promise.resolve();
  }, [map, clearRoute]);

  const value = {
    map,
    setMap,
    clearRoute,
    drawWalkingRoute,
  };

  return <AMapContext.Provider value={value}>{children}</AMapContext.Provider>;
}

export function useAMap() {
  const ctx = useContext(AMapContext);
  return ctx;
}
