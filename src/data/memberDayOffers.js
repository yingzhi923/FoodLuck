const memberDayOffers = [
  {
    weekday: 0,
    title: '周日',
    items: [
      { brand: '肯德基', offer: '八拼五折', ctaLabel: '一键前往' },
    ],
  },
  {
    weekday: 1,
    title: '周一',
    items: [
      { brand: '麦当劳', offer: '会员日', ctaLabel: '一键前往' },
      { brand: '喜茶', offer: '免配送费', ctaLabel: '一键前往' },
      { brand: '罗森', offer: '满15减5', ctaLabel: '一键前往' },
      { brand: '蜜雪冰城', offer: '咖啡3.99元', ctaLabel: '一键前往' },
      { brand: '袁记云饺', offer: '0.1元加云吞', ctaLabel: '一键前往' },
      { brand: '一点点', offer: '会员日送优惠券/换牛乳券/加布丁', ctaLabel: '一键前往' },
      { brand: '宝藏绿洲', offer: '全场88折', ctaLabel: '一键前往' },
      { brand: '遇见小面', offer: '免配送费', ctaLabel: '一键前往' },
    ],
  },
  {
    weekday: 2,
    title: '周二',
    items: [
      { brand: '阿嫲手作', offer: '免配送费', ctaLabel: '一键前往' },
      { brand: '塔斯汀', offer: '会员日', ctaLabel: '一键前往' },
      { brand: '罗森', offer: '满20减4', ctaLabel: '一键前往' },
      { brand: '蛙小侠', offer: '会员日', ctaLabel: '一键前往' },
      { brand: '喜茶', offer: '免费加小料', ctaLabel: '一键前往' },
      { brand: 'COCO', offer: '小料免费', ctaLabel: '一键前往' },
      { brand: '达美乐', offer: '七折优惠', ctaLabel: '一键前往' },
      { brand: '正新鸡排', offer: '15元两个', ctaLabel: '一键前往' },
      { brand: 'Taco Bell', offer: '买一送一', ctaLabel: '一键前往' },
      { brand: '茉沏', offer: '第二杯半价', ctaLabel: '一键前往' },
    ],
  },
  {
    weekday: 3,
    title: '周三',
    items: [
      { brand: '达美乐', offer: '七折优惠', ctaLabel: '一键前往' },
      { brand: '蜜雪冰城', offer: '满12减2', ctaLabel: '一键前往' },
      { brand: '必胜客', offer: '尖叫星期三', ctaLabel: '一键前往' },
      { brand: '正新鸡排', offer: '汉堡9.9元三个', ctaLabel: '一键前往' },
      { brand: '霸王茶姬', offer: '外卖免配送费 / 堂食85折', ctaLabel: '一键前往' },
      { brand: '茶百道', offer: '会员免费中杯升大杯', ctaLabel: '一键前往' },
      { brand: 'Tims', offer: '贝果堡套餐半价', ctaLabel: '一键前往' },
      { brand: '塔斯汀', offer: '翅桶用券约10元6个', ctaLabel: '一键前往' },
      { brand: '古茗', offer: '12点公众号抢免单券 / 买一送一', ctaLabel: '一键前往' },
      { brand: '乐乐茶', offer: '第二杯半价', ctaLabel: '一键前往' },
      { brand: '茶颜悦色', offer: '会员日', ctaLabel: '一键前往' },
      { brand: '吉田三上', offer: '满100减50 / 满50减25', ctaLabel: '一键前往' },
      { brand: '汉堡王', offer: '国王日9.9元狠霸王/双层芝士牛堡', ctaLabel: '一键前往' },
      { brand: '察理', offer: '第二杯半价', ctaLabel: '一键前往' },
      { brand: '海底捞', offer: '会员日送菜品', ctaLabel: '一键前往' },
      { brand: '星巴克', offer: '蛋糕三明治7折 / 满30送美式', ctaLabel: '一键前往' },
      { brand: '享多味', offer: '13元3个汉堡', ctaLabel: '一键前往' },
    ],
  },
  {
    weekday: 4,
    title: '周四',
    items: [
      { brand: '肯德基', offer: '疯狂星期四', ctaLabel: '一键前往' },
      { brand: '茶百道', offer: '全场88折', ctaLabel: '一键前往' },
      { brand: '汉堡王', offer: '8.8元两件小食', ctaLabel: '一键前往' },
      { brand: '麦当劳', offer: '麦麦熏鸡', ctaLabel: '一键前往' },
      { brand: '老乡鸡', offer: '送鸡腿', ctaLabel: '一键前往' },
    ],
  },
  {
    weekday: 5,
    title: '周五',
    items: [
      { brand: '华莱士', offer: '会员日买一送一', ctaLabel: '一键前往' },
      { brand: '肯德基', offer: '28元8个帕尼尼', ctaLabel: '一键前往' },
    ],
  },
  {
    weekday: 6,
    title: '周六',
    items: [
      { brand: '罗森', offer: '酸奶鲜奶三件55折', ctaLabel: '一键前往' },
      { brand: '肯德基', offer: '八拼五折', ctaLabel: '一键前往' },
    ],
  },
];

export function getTodayOffers() {
  const today = new Date().getDay();
  return memberDayOffers.find(d => d.weekday === today) || memberDayOffers[0];
}

/** Get offers for a specific weekday (0=周日, 1=周一, ..., 6=周六) */
export function getOffersByWeekday(weekday) {
  return memberDayOffers.find(d => d.weekday === weekday) || memberDayOffers[0];
}

export default memberDayOffers;
