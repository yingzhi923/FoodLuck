import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LOADING_TEXTS = [
  '今日食运加载中...',
  '你今天的口福正在生成...',
  '签筒摇晃中...',
  '命运的齿轮开始转动...',
];

export default function ShakeAnimation({ candidates }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setTextIndex(prev => (prev + 1) % LOADING_TEXTS.length);
    }, 1200);
    return () => clearTimeout(textTimer);
  }, [textIndex]);

  useEffect(() => {
    if (candidates.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % candidates.length);
    }, speed);

    const slowDown = setTimeout(() => setSpeed(200), 1500);
    const slowDown2 = setTimeout(() => setSpeed(350), 2200);

    return () => {
      clearInterval(timer);
      clearTimeout(slowDown);
      clearTimeout(slowDown2);
    };
  }, [candidates.length, speed]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Fortune stick animation */}
      <motion.div
        animate={{
          rotate: [0, -8, 8, -5, 5, -3, 3, 0],
          y: [0, -4, 0, -2, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-7xl mb-6"
      >
        🏮
      </motion.div>

      {/* Scrolling candidates */}
      <div className="relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: speed / 1000 * 0.6 }}
            className="font-bold text-lg text-center"
          >
            🎋 {candidates[currentIndex]?.name || '...'}
          </motion.div>
        </div>
      </div>

      {/* Loading text */}
      <motion.p
        key={textIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground"
      >
        {LOADING_TEXTS[textIndex]}
      </motion.p>

      {/* Decorative dots */}
      <div className="flex gap-1.5 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );
}
