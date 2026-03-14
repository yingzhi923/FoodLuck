import { useState, useCallback } from 'react';

export default function useMapInteraction() {
  const [selectedId, setSelectedId] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const selectRestaurant = useCallback((id, restaurants) => {
    setSelectedId(id);

    if (mapInstance && id) {
      const restaurant = restaurants.find(r => r.id === id);
      if (restaurant) {
        mapInstance.setCenter([restaurant.coordinates.lng, restaurant.coordinates.lat]);
        mapInstance.setZoom(16);
      }
    }
  }, [mapInstance]);

  const navigateTo = useCallback((restaurant) => {
    const url = `https://uri.amap.com/navigation?to=${restaurant.coordinates.lng},${restaurant.coordinates.lat},${encodeURIComponent(restaurant.name)}&mode=walking&callnative=1`;
    window.open(url, '_blank');
  }, []);

  return {
    selectedId,
    setSelectedId,
    mapInstance,
    setMapInstance,
    selectRestaurant,
    navigateTo,
  };
}
