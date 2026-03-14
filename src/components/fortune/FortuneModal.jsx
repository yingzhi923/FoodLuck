import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConditionSelect from './ConditionSelect';
import CandidatePool from './CandidatePool';
import ShakeAnimation from './ShakeAnimation';
import FortuneResult from './FortuneResult';
import restaurants from '@/data/restaurants';
import { filterRestaurants, getRandomItems } from '@/utils/filter';
import { generateFortune } from '@/utils/fortune';
import useFortuneStore from '@/hooks/useFortuneStore';

const SHAKE_DURATION_MS = 2800;

export default function FortuneModal({ open, onClose }) {
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

  if (!open) return null;

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
        className="relative w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏮</span>
            <h2 className="font-bold text-lg">今日食运</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1 px-4 pt-3">
          {['选条件', '看候选', '摇签', '结果'].map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
              <p className={`text-[10px] mt-1 text-center ${i <= step ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          <AnimatePresence mode="sync">
            {step === 0 && (
              <motion.div key="conditions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ConditionSelect onSubmit={handleConditionsSubmit} />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="candidates" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <CandidatePool
                  candidates={candidates}
                  setCandidates={setCandidates}
                  onStartShake={handleStartShake}
                  onBack={() => setStep(0)}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="shaking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ShakeAnimation candidates={candidates} />
              </motion.div>
            )}
            {step === 3 && result && fortune && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <FortuneResult
                  restaurant={result}
                  fortune={fortune}
                  onReshake={handleReshake}
                />
              </motion.div>
            )}
            {step === 3 && (!result || !fortune) && (
              <motion.div key="result-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center text-muted-foreground text-sm">
                结果生成中…
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
