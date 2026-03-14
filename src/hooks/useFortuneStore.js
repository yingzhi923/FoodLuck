import { useState, useCallback } from 'react';

const HISTORY_KEY = 'fortune_history';

function loadHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch { /* noop */ }
}

export default function useFortuneStore() {
  const [customPool, setCustomPool] = useState([]);
  const [history, setHistory] = useState(loadHistory);

  const addToPool = useCallback((restaurant) => {
    setCustomPool(prev => {
      if (prev.some(r => r.id === restaurant.id)) return prev;
      return [...prev, restaurant];
    });
  }, []);

  const removeFromPool = useCallback((id) => {
    setCustomPool(prev => prev.filter(r => r.id !== id));
  }, []);

  const clearPool = useCallback(() => {
    setCustomPool([]);
  }, []);

  const addToHistory = useCallback((result) => {
    setHistory(prev => {
      const next = [{ ...result, timestamp: Date.now() }, ...prev].slice(0, 20);
      saveHistory(next);
      return next;
    });
  }, []);

  const getRecentIds = useCallback(() => {
    return history.slice(0, 5).map(h => h.restaurantId);
  }, [history]);

  return {
    customPool,
    setCustomPool,
    addToPool,
    removeFromPool,
    clearPool,
    history,
    addToHistory,
    getRecentIds,
  };
}
