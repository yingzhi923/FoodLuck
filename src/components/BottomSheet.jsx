import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const SNAP_COLLAPSED = 8;
const SNAP_EXPANDED = 50;

const DRAG_THRESHOLD_PX = 5;

export default function BottomSheet({ children, className }) {
  const [height, setHeight] = useState(SNAP_COLLAPSED);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(SNAP_COLLAPSED);

  const isExpanded = height > (SNAP_COLLAPSED + SNAP_EXPANDED) / 2;

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const delta = startY.current - e.clientY;
    if (Math.abs(delta) > DRAG_THRESHOLD_PX) didDrag.current = true;
    const vh = window.innerHeight;
    const deltaPercent = (delta / vh) * 100;
    const next = Math.max(SNAP_COLLAPSED, Math.min(SNAP_EXPANDED, startHeight.current + deltaPercent));
    setHeight(next);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.userSelect = '';
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);
    setHeight(prev => (prev > (SNAP_COLLAPSED + SNAP_EXPANDED) / 2 ? SNAP_EXPANDED : SNAP_COLLAPSED));
  }, [onPointerMove]);

  const onPointerDown = useCallback((e) => {
    dragging.current = true;
    didDrag.current = false;
    startY.current = e.clientY;
    startHeight.current = height;
    document.body.style.userSelect = 'none';
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
  }, [height, onPointerMove, onPointerUp]);

  const toggleExpand = () => {
    setHeight(prev => (prev >= SNAP_EXPANDED ? SNAP_COLLAPSED : SNAP_EXPANDED));
  };

  const onHandleClick = useCallback(() => {
    if (!didDrag.current) toggleExpand();
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-background rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]',
        'transition-[height] ease-out',
        dragging.current ? 'duration-0' : 'duration-300',
        className
      )}
      style={{ height: `${height}vh` }}
    >
      <div
        className="flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onDoubleClick={toggleExpand}
        onClick={onHandleClick}
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        {!isExpanded && (
          <p className="text-xs text-muted-foreground mt-1.5">附近热榜</p>
        )}
      </div>
      <div
        className={cn(
          'overflow-y-auto overscroll-contain px-4 pb-safe',
          isExpanded ? 'h-[calc(100%-20px)]' : 'h-0 overflow-hidden'
        )}
      >
        {children}
      </div>
    </div>
  );
}
