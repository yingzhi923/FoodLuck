import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Heart, Clock, Settings, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Heart, label: '我收藏的店', count: 0, color: 'text-red-400' },
    { icon: Clock, label: '最近抽过的签', count: 0, color: 'text-orange-400' },
    { icon: Settings, label: '饮食偏好设置', color: 'text-gray-400' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-orange-50 to-amber-50 px-4 pt-4 pb-8">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-2xl text-white shadow-md">
            🏮
          </div>
          <div>
            <h2 className="text-lg font-bold">食运旅人</h2>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>松江大学城 · 东华大学</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground mt-0.5">抽签次数</p>
          </div>
          <div>
            <p className="text-xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground mt-0.5">收藏店铺</p>
          </div>
          <div>
            <p className="text-xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground mt-0.5">许愿次数</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors ${
                i < menuItems.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="flex-1 text-sm text-left">{item.label}</span>
              {item.count !== undefined && (
                <span className="text-xs text-muted-foreground">{item.count}</span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="px-4 mt-4 mb-8">
        <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
          <p className="text-sm font-medium mb-1">今日食运 v1.0</p>
          <p className="text-xs text-muted-foreground">帮你决定今天吃什么 🍽️</p>
        </div>
      </div>
    </div>
  );
}
