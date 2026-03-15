/**
 * 首页地图专用：从全量餐厅中选出 20 家代表性商家，
 * 满足「空间分散（东南西北+中部）」和「品类多样」。
 * 全量数据仍用于今日食运、许愿、搜索等，此处不修改 schema。
 */

const HOMEPAGE_MAP_COUNT = 20;

// 与默认地图视野一致，用于分区（中部 + 东南西北）
const VIEW = {
  lngMin: 121.205,
  lngMax: 121.230,
  latMin: 31.038,
  latMax: 31.056,
};

function getZone(r) {
  const { lng, lat } = r.coordinates;
  if (lng >= 121.212 && lng <= 121.220 && lat >= 31.043 && lat <= 31.049) return 'center';
  if (lat >= 31.050) return 'north';
  if (lat <= 31.042) return 'south';
  if (lng >= 121.223) return 'east';
  if (lng <= 121.209) return 'west';
  return 'center';
}

const ZONE_ORDER = ['center', 'north', 'south', 'east', 'west'];

/**
 * 从一组餐厅中按品类多样性选取最多 n 家（确定性：同 id 顺序一致）
 */
function pickDiverse(zoneRestaurants, n) {
  if (zoneRestaurants.length <= n) return zoneRestaurants.slice();
  const byCuisine = {};
  for (const r of zoneRestaurants) {
    const c = r.cuisine || '其他';
    if (!byCuisine[c]) byCuisine[c] = [];
    byCuisine[c].push(r);
  }
  for (const c of Object.keys(byCuisine)) {
    byCuisine[c].sort((a, b) => Number(a.id) - Number(b.id));
  }
  const cuisines = Object.keys(byCuisine).sort();
  const result = [];
  let round = 0;
  while (result.length < n) {
    let added = false;
    for (const c of cuisines) {
      if (result.length >= n) break;
      const list = byCuisine[c];
      if (round < list.length) {
        result.push(list[round]);
        added = true;
      }
    }
    if (!added) break;
    round++;
  }
  return result.slice(0, n);
}

/**
 * 从全量 restaurants 中选出 20 家用于首页地图展示。
 * 空间上覆盖中部 + 东南西北，品类上尽量多样。
 * @param {Array} restaurants 全量餐厅列表（不修改）
 * @returns {Array} 20 家餐厅子集，保持原对象引用
 */
export function getHomepageMapRestaurants(restaurants) {
  if (!Array.isArray(restaurants) || restaurants.length === 0) return [];
  if (restaurants.length <= HOMEPAGE_MAP_COUNT) return restaurants.slice();

  const byZone = {};
  for (const z of ZONE_ORDER) byZone[z] = [];
  for (const r of restaurants) {
    const z = getZone(r);
    byZone[z].push(r);
  }

  const selected = [];
  const perZone = Math.floor(HOMEPAGE_MAP_COUNT / ZONE_ORDER.length);
  const remainder = HOMEPAGE_MAP_COUNT - perZone * ZONE_ORDER.length;

  for (let i = 0; i < ZONE_ORDER.length; i++) {
    const z = ZONE_ORDER[i];
    const zoneList = byZone[z];
    const want = perZone + (i < remainder ? 1 : 0);
    const picked = pickDiverse(zoneList, Math.min(want, zoneList.length));
    selected.push(...picked);
  }

  const need = HOMEPAGE_MAP_COUNT - selected.length;
  if (need <= 0) return selected.slice(0, HOMEPAGE_MAP_COUNT);

  const selectedIds = new Set(selected.map((r) => r.id));
  const rest = restaurants.filter((r) => !selectedIds.has(r.id));
  const byCuisineRest = {};
  for (const r of rest) {
    const c = r.cuisine || '其他';
    if (!byCuisineRest[c]) byCuisineRest[c] = [];
    byCuisineRest[c].push(r);
  }
  for (const c of Object.keys(byCuisineRest)) {
    byCuisineRest[c].sort((a, b) => Number(a.id) - Number(b.id));
  }
  const cuisinesRest = Object.keys(byCuisineRest).sort();
  let round = 0;
  while (selected.length < HOMEPAGE_MAP_COUNT) {
    let added = false;
    for (const c of cuisinesRest) {
      if (selected.length >= HOMEPAGE_MAP_COUNT) break;
      const list = byCuisineRest[c];
      if (round < list.length) {
        selected.push(list[round]);
        selectedIds.add(list[round].id);
        added = true;
      }
    }
    if (!added) break;
    round++;
  }

  return selected.slice(0, HOMEPAGE_MAP_COUNT);
}
