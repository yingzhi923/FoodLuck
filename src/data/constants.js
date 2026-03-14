export const STUDENT_TAGS = [
  '20元吃饱', '宿舍党友好', '一个人也能吃', '约饭不踩雷',
  '适合赶时间', '适合坐着聊天', '夜宵救命', '重口解压',
  '清淡养胃', '考试周续命', '打卡型餐厅', '性价比之选',
  '聚餐友好', '少排队', '近食堂替代',
];

export const CUISINES = [
  '中餐', '日料', '韩餐', '泰餐', '西式', '烧烤',
  '麻辣烫', '火锅', '奶茶甜品', '咖啡', '面食', '快餐', '轻食',
];

export const CATEGORIES = ['正餐', '小吃', '甜品', '夜宵'];

export const SCENARIOS = [
  '一个人吃', '朋友聚餐', '约饭不踩雷', '赶时间', '聊天坐坐', '夜宵',
];

export const BUDGET_OPTIONS = [
  { label: '20元以内', value: 20 },
  { label: '30元以内', value: 30 },
  { label: '50元以内', value: 50 },
  { label: '80元以内', value: 80 },
];

export const WALKING_OPTIONS = [
  { label: '5分钟', value: 5 },
  { label: '10分钟', value: 10 },
  { label: '15分钟', value: 15 },
];

export const PEOPLE_OPTIONS = [
  { label: '1人', value: 1 },
  { label: '2人', value: 2 },
  { label: '3-4人', value: 4 },
  { label: '聚餐', value: 8 },
];

export const EXCLUDE_OPTIONS = ['不吃辣', '不吃面', '不想吃汉堡', '不要连锁'];

export const FORTUNE_LEVELS = [
  {
    level: '大吉', emoji: '🎊', color: 'text-red-500',
    messages: [
      '今天适合吃点热乎的！', '今天运势超旺，去吃好的！',
      '大吉大利，今晚吃鸡！', '今天的你，值得一顿好的。',
    ],
  },
  {
    level: '小吉', emoji: '✨', color: 'text-orange-500',
    messages: [
      '这顿稳了，不容易踩雷。', '小确幸从一顿好饭开始。',
      '今天的选择不会让你后悔。', '运气不错，放心去吃！',
    ],
  },
  {
    level: '平签', emoji: '🍀', color: 'text-green-600',
    messages: [
      '普通的一天，也值得认真吃饭。', '平平淡淡才是真，好好吃饭。',
      '日常的一餐，简单就好。', '随便吃吃也不错。',
    ],
  },
];

// 上海对外经贸大学松江校区 文翔路1900号（201620）
export const CAMPUS_CENTER = { lng: 121.216334, lat: 31.04633 };

export const SCHOOLS = [
  '东华大学', '上海外国语大学', '华东政法大学',
  '上海视觉艺术学院', '上海工程技术大学', '上海对外经贸大学',
  '上海立信会计金融学院',
];

export const CUISINE_GRADIENTS = {
  '中餐': 'from-orange-400 to-red-400',
  '面食': 'from-amber-400 to-orange-400',
  '日料': 'from-pink-300 to-rose-400',
  '韩餐': 'from-blue-300 to-indigo-400',
  '泰餐': 'from-green-400 to-emerald-500',
  '西式': 'from-amber-300 to-yellow-500',
  '快餐': 'from-yellow-400 to-orange-400',
  '烧烤': 'from-red-500 to-orange-600',
  '麻辣烫': 'from-red-400 to-rose-500',
  '火锅': 'from-red-500 to-red-700',
  '奶茶甜品': 'from-pink-300 to-purple-300',
  '咖啡': 'from-amber-600 to-amber-800',
  '轻食': 'from-green-300 to-lime-400',
  '台式': 'from-orange-300 to-amber-400',
  '港式': 'from-yellow-400 to-amber-500',
  '东北菜': 'from-amber-500 to-orange-500',
  '川菜': 'from-red-500 to-orange-500',
  '湘菜': 'from-red-400 to-amber-500',
  '新疆菜': 'from-amber-400 to-red-400',
  '串串': 'from-red-400 to-orange-500',
  '小龙虾': 'from-red-500 to-rose-600',
  '甜品': 'from-pink-200 to-rose-300',
  '面包': 'from-amber-300 to-orange-300',
  default: 'from-gray-300 to-gray-400',
};
