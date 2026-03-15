/**
 * 确定性地图点位分布：在指定可视范围内自由散点，无商业带/簇状/网格。
 * 200 家餐厅在范围内自然分布，同一份代码多次刷新点位不变。
 */
import { CAMPUS_CENTER } from '@/data/constants';

// 必须遵守的坐标范围（用户给定的地图可视范围）
// 左上角 31.05688261672305, 121.196079935786 | 左下角 31.039452179273262, 121.20127166765923
// 右上角 31.056036451286488, 121.24023059840819 | 右下角 31.03833716657116, 121.23966126121562
const VIEW = {
  lngMin: 121.196079935786,
  lngMax: 121.24023059840819,
  latMin: 31.03833716657116,
  latMax: 31.05688261672305,
};

const LNG_W = VIEW.lngMax - VIEW.lngMin;
const LAT_H = VIEW.latMax - VIEW.latMin;

function clampLng(lng) {
  return Math.max(VIEW.lngMin, Math.min(VIEW.lngMax, lng));
}
function clampLat(lat) {
  return Math.max(VIEW.latMin, Math.min(VIEW.latMax, lat));
}

/**
 * 确定性哈希：用 index 和 salt 得到 [0, 1) 的稳定小数，且 0..199 均匀覆盖全范围。
 * 使用 32 位整数哈希避免旧实现中 (index+1)*salt 对 200 个 index 只覆盖部分区间的问题。
 */
function hash01(index, salt) {
  const s = salt ?? 7919;
  const n = (index * 200 + (index % 17)) * s;
  const u32 = (n * 2654435761) >>> 0;
  return u32 / 4294967296;
}

/**
 * 根据索引返回确定性坐标，index 从 0 到 199。
 * 在给定范围内自由分布，无商业带、无簇、无网格，自然散开。
 */
export function getRestaurantCoordinate(index) {
  if (index < 0 || index >= 200) {
    throw new Error('index must be 0..199');
  }
  const u = hash01(index, 7919);
  const v = hash01(index, 31);
  const lng = VIEW.lngMin + u * LNG_W;
  const lat = VIEW.latMin + v * LAT_H;
  return { lng: clampLng(lng), lat: clampLat(lat) };
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
