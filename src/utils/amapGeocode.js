/**
 * Reverse geocode: get address string from (lng, lat).
 * Uses AMap.Geocoder when available (requests go via serviceHost proxy).
 * @param {number} lng
 * @param {number} lat
 * @returns {Promise<string>} formatted address or empty string
 */
export function getAddressFromCoords(lng, lat) {
  if (typeof window === 'undefined' || !window.AMap) {
    return Promise.resolve('');
  }
  return new Promise((resolve) => {
    window.AMap.plugin(['AMap.Geocoder'], () => {
      const geocoder = new window.AMap.Geocoder();
      geocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result?.regeocode?.formattedAddress) {
          resolve(result.regeocode.formattedAddress);
        } else {
          resolve('');
        }
      });
    });
  });
}
