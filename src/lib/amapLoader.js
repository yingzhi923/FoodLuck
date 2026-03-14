/**
 * Load AMap JS API 2.0 with security proxy support.
 * Must set window._AMapSecurityConfig.serviceHost before the script loads.
 * @param {string} key - VITE_AMAP_KEY
 * @param {{ plugins?: string[] }} options - optional plugins, e.g. ['AMap.Geocoder', 'AMap.AutoComplete']
 * @returns {Promise<typeof window.AMap>}
 */
export function loadAMap(key, options = {}) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('AMap can only run in browser'));
  }
  if (window.AMap) {
    return Promise.resolve(window.AMap);
  }
  if (!key) {
    return Promise.reject(new Error('VITE_AMAP_KEY is required to load AMap'));
  }

  const proxyUrl = import.meta.env.VITE_AMAP_PROXY_URL;
  if (proxyUrl && !window._AMapSecurityConfig) {
    window._AMapSecurityConfig = { serviceHost: proxyUrl };
  }

  const plugins = options.plugins && options.plugins.length
    ? options.plugins.join(',')
    : 'AMap.Geocoder';

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}&plugin=${plugins}`;
  script.async = false;

  return new Promise((resolve, reject) => {
    script.onload = () => resolve(window.AMap);
    script.onerror = () => reject(new Error('Failed to load AMap script'));
    document.head.appendChild(script);
  });
}

/**
 * Load additional AMap plugins on demand (after loadAMap has run).
 * @param {string[]} pluginNames - e.g. ['AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Walking']
 * @returns {Promise<void>}
 */
export function loadAMapPlugins(pluginNames) {
  if (typeof window === 'undefined' || !window.AMap) {
    return Promise.reject(new Error('AMap not loaded yet'));
  }
  return new Promise((resolve, reject) => {
    window.AMap.plugin(pluginNames, () => resolve());
  });
}
