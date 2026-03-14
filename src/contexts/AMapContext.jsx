import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const AMapContext = createContext(null);

export function AMapProvider({ children }) {
  const [map, setMap] = useState(null);
  const routeOverlaysRef = useRef([]);

  const clearRoute = useCallback(() => {
    if (!map) return;
    routeOverlaysRef.current.forEach((overlay) => {
      try {
        map.remove(overlay);
      } catch (_) {}
    });
    routeOverlaysRef.current = [];
  }, [map]);

  const drawWalkingRoute = useCallback((origin, dest) => {
    if (!window.AMap || !map) return Promise.reject(new Error('Map not ready'));
    return new Promise((resolve, reject) => {
      window.AMap.plugin(['AMap.Walking'], () => {
        clearRoute();
        const walking = new window.AMap.Walking({ map });
        const start = Array.isArray(origin) ? origin : [origin.lng, origin.lat];
        const end = Array.isArray(dest) ? dest : [dest.lng, dest.lat];
        walking.search(start, end, (status, result) => {
          if (status === 'complete' && result.routes && result.routes.length) {
            const path = result.routes[0].steps.flatMap((s) => s.path || []);
            if (path.length) {
              const polyline = new window.AMap.Polyline({
                path,
                strokeColor: '#F97316',
                strokeWeight: 6,
                strokeOpacity: 0.9,
              });
              map.add(polyline);
              routeOverlaysRef.current.push(polyline);
              map.setFitView([path], 40);
            }
            resolve(result);
          } else {
            reject(new Error('Route not found'));
          }
        });
      });
    });
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
