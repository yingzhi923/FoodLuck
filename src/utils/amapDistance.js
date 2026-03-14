/**
 * Get straight-line distance in meters between two points (rough).
 * When AMap is loaded, uses AMap.GeometryUtil.distanceOfLine for consistency.
 * Otherwise uses Haversine.
 * @param {{ lng: number, lat: number }} a
 * @param {{ lng: number, lat: number }} b
 * @returns {number} distance in meters
 */
export function getDistanceMeters(a, b) {
  if (typeof window !== 'undefined' && window.AMap?.GeometryUtil) {
    return window.AMap.GeometryUtil.distance(
      new window.AMap.LngLat(a.lng, a.lat),
      new window.AMap.LngLat(b.lng, b.lat)
    );
  }
  const R = 6371000; // Earth radius in meters
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
