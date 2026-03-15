/**
 * 确定性地图点位分布：在 zoom=15、center=上海对外经贸大学 的视野内，
 * 采用「多条商业带/道路带 + 少量背景散点」策略，使 200 个餐厅像真实街区分布，
 * 沿道路有疏有密，无 9 簇葡萄串感。同一份代码多次刷新点位不变。
 */
import { CAMPUS_CENTER } from '@/data/constants';

// 与 MapView 中 zoom=15 可视范围一致，松江大学城合理范围
const VIEW = {
  lngMin: 121.205,
  lngMax: 121.230,
  latMin: 31.038,
  latMax: 31.056,
};

const LNG_W = VIEW.lngMax - VIEW.lngMin;
const LAT_H = VIEW.latMax - VIEW.latMin;

// 商业带/道路带：每条为线段 (start -> end)，模拟主干道或商业街
// 横向、纵向、斜向混合，覆盖视野内北中南、东西中
const CORRIDORS = [
  { start: { lng: 121.206, lat: 31.040 }, end: { lng: 121.229, lat: 31.040 } },
  { start: { lng: 121.206, lat: 31.044 }, end: { lng: 121.229, lat: 31.044 } },
  { start: { lng: 121.206, lat: 31.048 }, end: { lng: 121.229, lat: 31.048 } },
  { start: { lng: 121.206, lat: 31.052 }, end: { lng: 121.228, lat: 31.052 } },
  { start: { lng: 121.211, lat: 31.038 }, end: { lng: 121.211, lat: 31.055 } },
  { start: { lng: 121.216, lat: 31.038 }, end: { lng: 121.216, lat: 31.055 } },
  { start: { lng: 121.221, lat: 31.038 }, end: { lng: 121.221, lat: 31.055 } },
  { start: { lng: 121.226, lat: 31.039 }, end: { lng: 121.226, lat: 31.054 } },
  { start: { lng: 121.207, lat: 31.041 }, end: { lng: 121.228, lat: 31.051 } },
  { start: { lng: 121.208, lat: 31.051 }, end: { lng: 121.227, lat: 31.041 } },
  { start: { lng: 121.209, lat: 31.039 }, end: { lng: 121.225, lat: 31.053 } },
  { start: { lng: 121.224, lat: 31.039 }, end: { lng: 121.208, lat: 31.053 } },
  { start: { lng: 121.206, lat: 31.046 }, end: { lng: 121.229, lat: 31.046 } },
  { start: { lng: 121.214, lat: 31.038 }, end: { lng: 121.214, lat: 31.054 } },
  { start: { lng: 121.219, lat: 31.039 }, end: { lng: 121.219, lat: 31.054 } },
];

const NUM_CORRIDORS = CORRIDORS.length;
// 约 12% 为背景散点，其余沿商业带分布
const BACKGROUND_THRESHOLD = 24; // (i * 17) % 100 < 24 约 24% 若用 < 24；改为每约 6 个取 1 个背景
const CORRIDOR_HALF_WIDTH = 0.0014; // 带内垂直于道路的偏移范围（度），约 150m

function clampLng(lng) {
  return Math.max(VIEW.lngMin, Math.min(VIEW.lngMax, lng));
}
function clampLat(lat) {
  return Math.max(VIEW.latMin, Math.min(VIEW.latMax, lat));
}

// 确定性哈希：用 index 得到 [0, 1) 的稳定小数，避免规则网格
function hash01(index, salt) {
  const s = salt ?? 7919;
  const x = ((index + 1) * s) % 1000000;
  return (Math.abs(x) % 10000) / 10000;
}

function hashRange(index, salt, min, max) {
  return min + hash01(index, salt) * (max - min);
}

/**
 * 根据索引返回确定性坐标，index 从 0 到 199。
 * 策略：多数点沿多条商业带分布（沿线段 + 带内垂直抖动），少数为背景散点。
 */
export function getRestaurantCoordinate(index) {
  if (index < 0 || index >= 200) {
    throw new Error('index must be 0..199');
  }

  const isBackground = (index * 17 + index % 5) % 100 < 24;

  if (isBackground) {
    const u = hash01(index, 31);
    const v = hash01(index, 17);
    const lng = VIEW.lngMin + u * LNG_W * 0.92 + LNG_W * 0.04;
    const lat = VIEW.latMin + v * LAT_H * 0.92 + LAT_H * 0.04;
    return { lng: clampLng(lng), lat: clampLat(lat) };
  }

  const corridorIndex = (index * 19 + index) % NUM_CORRIDORS;
  const cor = CORRIDORS[corridorIndex];
  const dx = cor.end.lng - cor.start.lng;
  const dy = cor.end.lat - cor.start.lat;

  const t = hashRange(index, 13, 0.06, 0.94);
  const baseLng = cor.start.lng + t * dx;
  const baseLat = cor.start.lat + t * dy;

  const perp = hashRange(index, 11, -CORRIDOR_HALF_WIDTH, CORRIDOR_HALF_WIDTH);
  const len = Math.sqrt(dx * dx + dy * dy) || 1e-6;
  const nx = -dy / len;
  const ny = dx / len;

  const lng = clampLng(baseLng + nx * perp);
  const lat = clampLat(baseLat + ny * perp);

  return { lng, lat };
}

/**
 * 返回全部 200 个坐标的数组，用于静态生成 restaurants 数据。
 */
export function getAllCoordinates() {
  return Array.from({ length: 200 }, (_, i) => getRestaurantCoordinate(i));
}

// 与 PRD 一致：walkingMinutes 与 distanceText 对应关系
const WALKING_PRESETS = [
  [3, 240, '约240m'], [4, 300, '约300m'], [5, 400, '约400m'], [6, 480, '约480m'],
  [7, 560, '约560m'], [8, 640, '约640m'], [9, 720, '约720m'], [10, 800, '约800m'],
  [11, 880, '约880m'], [12, 960, '约960m'], [13, 1040, '约1km'], [14, 1120, '约1.1km'], [15, 1200, '约1.2km'],
];

function distanceToWalking(distanceM) {
  for (const [min, m, text] of WALKING_PRESETS) {
    if (distanceM <= m + 100) return { walkingMinutes: min, distanceText: text };
  }
  return { walkingMinutes: 15, distanceText: '约1.2km' };
}

function haversineMeters(lng1, lat1, lng2, lat2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 根据坐标计算与 campus 的步行距离（近似：直线 * 1.25）并返回 walkingMinutes 与 distanceText。
 */
export function getWalkingFromCoordinate(coords) {
  const straightM = haversineMeters(
    CAMPUS_CENTER.lng, CAMPUS_CENTER.lat,
    coords.lng, coords.lat
  );
  const walkM = straightM * 1.25;
  return distanceToWalking(walkM);
}
