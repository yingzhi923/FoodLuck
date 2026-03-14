export function filterRestaurants(restaurants, filters = {}) {
  let result = [...restaurants];

  if (filters.budget) {
    result = result.filter(r => r.avgPrice <= filters.budget);
  }

  if (filters.walkingTime) {
    result = result.filter(r => r.walkingMinutes <= filters.walkingTime);
  }

  if (filters.cuisine) {
    result = result.filter(r => r.cuisine === filters.cuisine || r.cuisine.includes(filters.cuisine));
  }

  if (filters.category) {
    result = result.filter(r => r.category.includes(filters.category));
  }

  if (filters.people) {
    if (filters.people === 1) {
      result = result.filter(r => r.suitableForSolo);
    } else if (filters.people >= 4) {
      result = result.filter(r => r.suitableForGroup);
    }
  }

  if (filters.scenario) {
    result = result.filter(r => r.scenarios.includes(filters.scenario));
  }

  if (filters.excludes && filters.excludes.length > 0) {
    if (filters.excludes.includes('不吃辣')) {
      result = result.filter(r => r.spicyLevel === '不辣' || r.spicyLevel === '微辣');
    }
    if (filters.excludes.includes('不吃面')) {
      result = result.filter(r => !r.cuisine.includes('面') && !r.name.includes('面'));
    }
    if (filters.excludes.includes('不要连锁')) {
      result = result.filter(r => !r.isChain);
    }
    if (filters.excludes.includes('不想吃汉堡')) {
      result = result.filter(r => !r.name.includes('汉堡') && r.cuisine !== '快餐');
    }
  }

  if (filters.search) {
    const keyword = filters.search.toLowerCase();
    result = result.filter(r =>
      r.name.toLowerCase().includes(keyword) ||
      r.cuisine.toLowerCase().includes(keyword) ||
      r.studentTags.some(t => t.includes(keyword)) ||
      r.category.some(c => c.includes(keyword))
    );
  }

  return result;
}

export function sortByDistance(restaurants) {
  return [...restaurants].sort((a, b) => a.walkingMinutes - b.walkingMinutes);
}

export function sortByPrice(restaurants) {
  return [...restaurants].sort((a, b) => a.avgPrice - b.avgPrice);
}

export function getRandomItems(items, count) {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRecommended(restaurants, count = 5) {
  const featured = restaurants.filter(r => r.featured);
  if (featured.length >= count) return getRandomItems(featured, count);
  const rest = restaurants.filter(r => !r.featured);
  return [...featured, ...getRandomItems(rest, count - featured.length)];
}
