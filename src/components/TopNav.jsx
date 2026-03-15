import React from 'react';
import { MapPin, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import iconPng from '@/assets/brand/icon.png';

function getStoredSchool() {
  try { return localStorage.getItem('selected_school') || '东华大学'; }
  catch { return '东华大学'; }
}

export default function TopNav({ onFortuneClick }) {
  const navigate = useNavigate();
  const currentSchool = getStoredSchool();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/50 safe-area-top">
      <div className="relative flex items-center justify-between h-12 px-3 max-w-lg mx-auto">
        <button className="flex items-center gap-1 text-sm text-muted-foreground shrink-0 z-10">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="max-w-[90px] truncate">松江大学城</span>
          <span className="text-xs text-border">|</span>
          <span className="max-w-[70px] truncate text-foreground font-medium">{currentSchool}</span>
        </button>

        {/* Center Floating Brand Button */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 z-20">
          <button
            onClick={onFortuneClick}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary via-orange-400 to-amber-400 text-white font-black text-lg shadow-[0_8px_20px_-6px_rgba(234,88,12,0.6)] hover:shadow-[0_12px_24px_-6px_rgba(234,88,12,0.7)] active:scale-95 transition-all border-4 border-white"
          >
            <img src={iconPng} alt="" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="tracking-widest pt-0.5">今日食运</span>
          </button>
        </div>

        <div className="flex items-center gap-1 z-10">
          <button
            onClick={() => navigate('/search')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <User className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </nav>
  );
}
