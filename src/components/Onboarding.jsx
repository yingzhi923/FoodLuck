import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { SCHOOLS } from '@/data/constants';

const ONBOARDING_KEY = 'onboarding_done';

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

  const handleComplete = () => {
    onComplete(selectedSchool || '东华大学');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
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
              className="text-7xl mb-6"
            >
              🏮
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
