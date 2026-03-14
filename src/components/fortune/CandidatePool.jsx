import React, { useState } from 'react';
import { X, Plus, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import restaurants from '@/data/restaurants';

export default function CandidatePool({ candidates, setCandidates, onStartShake, onBack }) {
  const [showAdd, setShowAdd] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleRemove = (id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const handleAdd = (restaurant) => {
    if (!candidates.some(c => c.id === restaurant.id)) {
      setCandidates(prev => [...prev, restaurant]);
    }
    setShowAdd(false);
    setSearchText('');
  };

  const addOptions = restaurants
    .filter(r => !candidates.some(c => c.id === r.id))
    .filter(r => !searchText || r.name.includes(searchText) || r.cuisine.includes(searchText))
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4" /> 改条件
        </button>
        <p className="text-xs text-muted-foreground">{candidates.length} 个候选</p>
      </div>

      <p className="text-sm text-muted-foreground">你的签筒里有这些，可以增删 👇</p>

      <div className="space-y-2">
        <AnimatePresence>
          {candidates.map((c, i) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50"
            >
              <span className="text-lg">🎋</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.cuisine} · ¥{c.avgPrice}</p>
              </div>
              <button
                onClick={() => handleRemove(c.id)}
                className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add button */}
      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary text-sm font-medium flex items-center justify-center gap-1 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <Plus className="w-4 h-4" /> 手动添加
        </button>
      ) : (
        <div className="space-y-2 p-3 rounded-xl bg-muted/50 border border-border/50">
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="搜索餐厅名或菜系..."
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            autoFocus
          />
          <div className="max-h-40 overflow-y-auto space-y-1">
            {addOptions.map(r => (
              <button
                key={r.id}
                onClick={() => handleAdd(r)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-background text-sm transition-colors"
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-muted-foreground ml-2">{r.cuisine} · ¥{r.avgPrice}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => { setShowAdd(false); setSearchText(''); }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            取消
          </button>
        </div>
      )}

      <button
        onClick={onStartShake}
        disabled={candidates.length < 2}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-orange-400 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        🎋 开始摇签（{candidates.length}个候选）
      </button>
    </div>
  );
}
