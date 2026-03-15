import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight, X } from 'lucide-react';
import { SCHOOLS } from '@/data/constants';
import iconPng from '@/assets/brand/icon.png';

const ONBOARDING_KEY = 'onboarding_done';
const MENTOR_LETTER_SEEN_KEY = 'mentor_letter_seen';

export function useOnboarding() {
  const [done, setDone] = useState(() => {
    try { return localStorage.getItem(ONBOARDING_KEY) === 'true'; }
    catch { return false; }
  });

  const complete = (school) => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      localStorage.setItem('selected_school', school);
    } catch { /* noop */ }
    setDone(true);
  };

  const getSchool = () => {
    try { return localStorage.getItem('selected_school') || '东华大学'; }
    catch { return '东华大学'; }
  };

  return { done, complete, getSchool };
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showLetter, setShowLetter] = useState(() => {
    try { return localStorage.getItem(MENTOR_LETTER_SEEN_KEY) !== 'true'; }
    catch { return true; }
  });

  const handleCloseLetter = () => {
    try { localStorage.setItem(MENTOR_LETTER_SEEN_KEY, 'true'); } catch { /* noop */ }
    setShowLetter(false);
  };

  const handleComplete = () => {
    onComplete(selectedSchool || '东华大学');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
      {/* 一次性信件弹窗 */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40"
            onClick={(e) => e.target === e.currentTarget && handleCloseLetter()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-lg max-h-[85vh] rounded-2xl bg-white shadow-xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleCloseLetter}
                className="absolute right-3 top-3 z-10 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="overflow-y-auto flex-1 p-6 pt-10 text-sm text-foreground leading-relaxed">
                <p className="mb-3">HiHi 亲爱的Mentor老师：</p>
                <p className="mb-4">在您正式开始体验我的产品之前，有一些ReadMe内容想要和您提前说～</p>
                <p className="mb-2">1. 本人没有在国内读大学的体验，所以用户痛点来自身边统计学和我在家的一些外卖烦恼，实际痛点有待用户调研</p>
                <p className="mb-2">2. 核心产品设计和解决方案是"有选择的随机"：这里有两个核心场景</p>
                <p className="pl-4 mb-1">a：不知道吃什么</p>
                <p className="pl-4 mb-2">对应核心功能 「抽一签」 可以直接开始摇签or简单筛选后摇签</p>
                <p className="pl-4 mb-1">b：大概知道想吃什么，但不知道去哪家</p>
                <p className="pl-4 mb-4">对应核心功能 「许个愿」 针对"用餐人数"和"用餐场景"的筛选进行推荐</p>
                <p className="mb-2">3. 「今日宜食」抓住大学生群体需要性价比之选的痛点，给出今天是会员日的商户，灵感来自我经常忘了今天是疯狂星期四</p>
                <p className="mb-4">4. 现在地图功能没接上，您脑补一下～接上的话应该是可以把摇签/许愿结果直接在地图上显示的。学校也是可以接通之后直接定位的，我现在是写死了您来自上海对外经贸大学我们现在在上海松江大学城～</p>
                <p className="mb-4">最后，无论如何都很感谢这个机会，这真是一个酣畅淋漓的项目！！治好了我的FOMO哈哈哈～目前版本的产品基本也都还是我一拍脑袋的想法，如果可以的话非常希望能在面试里被您亲自拷打并得到一些关于产品设计上的feedback能让我继续成长！</p>
                <p className="mb-2">祝您体验愉快～吃得香睡得好～</p>
                <p className="mb-1">Best,</p>
                <p>樱之</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="mb-6"
            >
              <img src={iconPng} alt="今日食运" className="w-20 h-20 object-contain" />
            </motion.div>
            <h1 className="text-3xl font-black text-foreground mb-2">今日食运</h1>
            <p className="text-base text-muted-foreground text-center leading-relaxed">
              帮你决定今天吃什么
            </p>
            <p className="text-sm text-muted-foreground/70 text-center mt-1">
              大学城周边美食地图 · 30秒做决定
            </p>
            <button
              onClick={() => setStep(1)}
              className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold text-base shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              开始使用 <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="school"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col px-6 pt-16"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">选择你的学校</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              我们会推荐你学校附近的美食
            </p>

            <div className="space-y-2 flex-1">
              {SCHOOLS.map(school => (
                <button
                  key={school}
                  onClick={() => setSelectedSchool(school)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl transition-all ${
                    selectedSchool === school
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-border hover:border-primary/50 hover:shadow-sm'
                  }`}
                >
                  <span className="font-medium text-sm">{school}</span>
                </button>
              ))}
            </div>

            <div className="py-6 space-y-3">
              <button
                onClick={handleComplete}
                disabled={!selectedSchool}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-orange-400 text-white font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all"
              >
                进入今日食运 🎋
              </button>
              <button
                onClick={() => onComplete('东华大学')}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                先跳过，稍后设置
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
