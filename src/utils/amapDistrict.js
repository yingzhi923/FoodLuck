/**
 * Get district boundary polygon (e.g. for drawing campus area).
 * Uses AMap.DistrictSearch when AMap is loaded.
 * @param {string} district - e.g. '松江区' or district name
 * @param {string} [level] - 'district' | 'city' etc.
 * @returns {Promise<Array<{lng: number, lat: number}[]>>} array of rings (first is outer boundary)
 */
export function getDistrictBoundary(district, level = 'district') {
  if (typeof window === 'undefined' || !window.AMap) {
    return Promise.resolve([]);
  }
  return new Promise((resolve) => {
    window.AMap.plugin(['AMap.DistrictSearch'], () => {
      const search = new window.AMap.DistrictSearch();
      search.search(district, (status, result) => {
        if (status === 'complete' && result?.districts?.[0]) {
          const bounds = result.districts[0].boundaries || [];
          const rings = bounds.map((ring) =>
            ring.map((p) => ({ lng: p.lng, lat: p.lat }))
          );
          resolve(rings);
        } else {
          resolve([]);
        }
      });
    });
  });
}
