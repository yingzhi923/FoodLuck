import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, Sparkles, Dices, BadgePercent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ConditionSelect from './ConditionSelect';
import CandidatePool from './CandidatePool';
import ShakeAnimation from './ShakeAnimation';
import FortuneResult from './FortuneResult';
import WishPanel from '@/components/wish/WishPanel';
import restaurants from '@/data/restaurants';
import { filterRestaurants, getRandomItems } from '@/utils/filter';
import { generateFortune } from '@/utils/fortune';
import useFortuneStore from '@/hooks/useFortuneStore';
import { getTodayOffers } from '@/data/memberDayOffers';
import iconPng from '@/assets/brand/icon.png';

const SHAKE_DURATION_MS = 2800;

const MODE_SELECT = 'mode';
const MODE_DRAW = 'draw';
const MODE_WISH = 'wish';
const MODE_TODAY = 'today';

export default function FortuneModal({ open, onClose }) {
  const [mode, setMode] = useState(MODE_SELECT);
  const [step, setStep] = useState(0);
  const [conditions, setConditions] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [result, setResult] = useState(null);
  const [fortune, setFortune] = useState(null);
  const candidatesRef = useRef([]);
  const { addToHistory, getRecentIds } = useFortuneStore();

  const handleConditionsSubmit = (conds) => {
    setConditions(conds);
    const filtered = filterRestaurants(restaurants, conds);
    const recentIds = getRecentIds();
    const nonRecent = filtered.filter(r => !recentIds.includes(r.id));
    const poolSource = nonRecent.length >= 4 ? nonRecent : filtered.length > 0 ? filtered : restaurants;
    const pool = getRandomItems(poolSource, 6);
    setCandidates(pool);
    setStep(1);
  };

  const handleQuickStart = () => {
    const recentIds = getRecentIds();
    const nonRecent = restaurants.filter(r => !recentIds.includes(r.id));
    const poolSource = nonRecent.length >= 4 ? nonRecent : restaurants;
    const pool = getRandomItems(poolSource, 6);
    setCandidates(pool);
    candidatesRef.current = pool;
    setStep(2);
  };

  const handleStartShake = () => {
    if (candidates.length === 0) return;
    candidatesRef.current = candidates;
    setStep(2);
  };

  useEffect(() => {
    if (step !== 2) return;
    const pool = candidatesRef.current;
    if (!pool || pool.length === 0) {
      setStep(1);
      return;
    }
    const timer = setTimeout(() => {
      const picked = pool[Math.floor(Math.random() * pool.length)];
      const fortuneResult = generateFortune();
      setResult(picked);
      setFortune(fortuneResult);
      addToHistory({ restaurantId: picked.id, restaurantName: picked.name, fortune: fortuneResult.level });
      setStep(3);
    }, SHAKE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [step, addToHistory]);

  const handleReshake = () => {
    const others = candidates.filter(c => !result || c.id !== result.id);
    if (others.length > 0) {
      candidatesRef.current = others;
      setStep(2);
    } else {
      candidatesRef.current = candidates;
      setStep(2);
    }
  };

  const handleReset = () => {
    setMode(MODE_SELECT);
    setStep(0);
    setConditions({});
    setCandidates([]);
    setResult(null);
    setFortune(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleBackToMode = () => {
    setMode(MODE_SELECT);
    setStep(0);
    setConditions({});
    setCandidates([]);
    setResult(null);
    setFortune(null);
  };

  if (!open) return null;

  const showBackButton = mode !== MODE_SELECT;

  const drawStepLabels = ['选条件', '看候选', '摇签', '结果'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[600px] bg-background rounded-t-3xl sm:rounded-3xl max-h-[88vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button
                onClick={handleBackToMode}
                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/10 mr-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <img src={iconPng} alt="今日食运" className="w-7 h-7 object-contain" />
            <h2 className="font-bold text-lg">今日食运</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator (draw mode only) */}
        {mode === MODE_DRAW && (
          <div className="flex gap-1 px-4 pt-3 shrink-0">
            {drawStepLabels.map((label, i) => (
              <div key={label} className="flex-1">
                <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
                <p className={`text-[10px] mt-1 text-center ${i <= step ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          <AnimatePresence mode="sync">
            {/* Mode selection */}
            {mode === MODE_SELECT && (
              <motion.div key="mode-select" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ModeSelectView
                  onTodayClick={() => setMode(MODE_TODAY)}
                  onDrawClick={() => setMode(MODE_DRAW)}
                  onWishClick={() => setMode(MODE_WISH)}
                />
              </motion.div>
            )}

            {/* Draw flow */}
            {mode === MODE_DRAW && step === 0 && (
              <motion.div key="conditions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ConditionSelect onSubmit={handleConditionsSubmit} onQuickStart={handleQuickStart} />
              </motion.div>
            )}
            {mode === MODE_DRAW && step === 1 && (
              <motion.div key="candidates" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <CandidatePool
                  candidates={candidates}
                  setCandidates={setCandidates}
                  onStartShake={handleStartShake}
                  onBack={() => setStep(0)}
                />
              </motion.div>
            )}
            {mode === MODE_DRAW && step === 2 && (
              <motion.div key="shaking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ShakeAnimation candidates={candidates} />
              </motion.div>
            )}
            {mode === MODE_DRAW && step === 3 && result && fortune && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <FortuneResult
                  restaurant={result}
                  fortune={fortune}
                  onReshake={handleReshake}
                />
              </motion.div>
            )}
            {mode === MODE_DRAW && step === 3 && (!result || !fortune) && (
              <motion.div key="result-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center text-muted-foreground text-sm">
                结果生成中…
              </motion.div>
            )}

            {/* Today deals flow */}
            {mode === MODE_TODAY && (
              <motion.div key="today" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <TodayDealsPanel />
              </motion.div>
            )}

            {/* Wish flow */}
            {mode === MODE_WISH && (
              <motion.div key="wish" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <WishPanel onSelectRestaurant={() => {}} selectedId={null} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function ModeSelectView({ onTodayClick, onDrawClick, onWishClick }) {
  const todayLabel = ['周日','周一','周二','周三','周四','周五','周六'][new Date().getDay()];

  return (
    <div className="space-y-4 py-2">
      <p className="text-center text-sm text-muted-foreground">选择你想怎么决定今天吃什么</p>

      <button
        onClick={onTodayClick}
        className="w-full p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200/60 hover:border-emerald-300 hover:shadow-md active:scale-[0.98] transition-all text-left group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm">
            <BadgePercent className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">今日宜食</h3>
        </div>
        <p className="text-sm text-muted-foreground pl-[52px]">
          今天{todayLabel}，看看哪里最划算
        </p>
      </button>

      <button
        onClick={onDrawClick}
        className="w-full p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200/60 hover:border-orange-300 hover:shadow-md active:scale-[0.98] transition-all text-left group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-sm">
            <Dices className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">抽一签</h3>
        </div>
        <p className="text-sm text-muted-foreground pl-[52px]">
          不知道吃什么，交给今日食运
        </p>
      </button>

      <button
        onClick={onWishClick}
        className="w-full p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200/60 hover:border-violet-300 hover:shadow-md active:scale-[0.98] transition-all text-left group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">许个愿</h3>
        </div>
        <p className="text-sm text-muted-foreground pl-[52px]">
          已经有点想法，按条件找合适的店
        </p>
      </button>
    </div>
  );
}

function TodayDealsPanel() {
  const todayData = getTodayOffers();

  const handleDealClick = (brand) => {
    toast('现在为您一键导航…（ps 此功能稍后上线哦）');
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="text-center">
        <h3 className="text-lg font-bold">今日宜食</h3>
        <p className="text-sm text-muted-foreground mt-1">
          今天是{todayData.title}，这些品牌更划算
        </p>
      </div>

      <div className="space-y-2">
        {todayData.items.map((item, i) => (
          <button
            key={`${item.brand}-${i}`}
            onClick={() => handleDealClick(item.brand)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 hover:border-emerald-300 hover:shadow-sm active:scale-[0.98] transition-all text-left"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm">{item.brand}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.offer}</p>
            </div>
            <span className="shrink-0 ml-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium">
              {item.ctaLabel}
            </span>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/70 text-center pt-2">
        优惠信息仅供参考，以平台实时活动为准
      </p>
    </div>
  );
}
