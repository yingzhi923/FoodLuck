import { FORTUNE_LEVELS } from '@/data/constants';

export function generateFortune() {
  const rand = Math.random();
  let level;
  if (rand < 0.3) level = FORTUNE_LEVELS[0];      // 30% 大吉
  else if (rand < 0.7) level = FORTUNE_LEVELS[1];  // 40% 小吉
  else level = FORTUNE_LEVELS[2];                   // 30% 平签

  const message = level.messages[Math.floor(Math.random() * level.messages.length)];
  return { ...level, message };
}

export function generateRecommendReason(restaurant) {
  const parts = [];
  if (restaurant.walkingMinutes <= 5) parts.push(`步行${restaurant.walkingMinutes}分钟就到`);
  else parts.push(`步行${restaurant.walkingMinutes}分钟`);

  parts.push(`人均${restaurant.avgPrice}元`);

  if (restaurant.studentTags.length > 0) {
    parts.push(restaurant.studentTags[0]);
  }

  return parts.join('，') + '。';
}
