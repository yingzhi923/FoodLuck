import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import restaurants from '@/data/restaurants';
import { CUISINE_GRADIENTS } from '@/data/constants';
import { getAddressFromCoords } from '@/utils/amapGeocode';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const r = restaurants.find(item => item.id === id);
  const [address, setAddress] = useState('');
  useEffect(() => {
    if (!r) return;
    getAddressFromCoords(r.coordinates.lng, r.coordinates.lat).then(setAddress);
  }, [r]);

  if (!r) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-4xl mb-3">😢</p>
          <p className="text-muted-foreground">餐厅未找到</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const gradient = CUISINE_GRADIENTS[r.cuisine] || CUISINE_GRADIENTS.default;

  const handleAddToFortune = () => {
    toast('正在为您新建签筒...（ps此功能稍后上线哦）');
  };

  const handleOpenMap = () => {
    toast('正在为您一键导航...（ps此功能稍后上线哦）');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header image */}
      <div className={cn('relative h-52 bg-gradient-to-br flex items-center justify-center', gradient)}>
        <span className="text-6xl opacity-70">{getCuisineEmoji(r.cuisine)}</span>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/40 text-white text-sm font-bold backdrop-blur-sm">
          ¥{r.avgPrice}/人
        </div>
      </div>

      <div className="px-4 -mt-4 relative">
        {/* Main info card */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
          <h1 className="text-xl font-bold">{r.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="px-2 py-0.5 rounded-md bg-muted">{r.cuisine}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{r.walkingMinutes}分钟</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{r.distanceText}</span>
          </div>
          {address ? (
            <p className="mt-1.5 text-xs text-muted-foreground flex items-start gap-1">
              <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
              <span>{address}</span>
            </p>
          ) : null}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {r.studentTags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h3 className="font-semibold text-sm mb-1.5">推荐理由</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{r.recommendReason}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">{r.description}</p>
        </div>

        {/* Recommended dishes */}
        <div className="mt-4">
          <h3 className="font-semibold text-sm mb-2">推荐菜</h3>
          <div className="flex flex-wrap gap-2">
            {r.recommendedDishes.map(dish => (
              <span key={dish} className="px-3 py-1.5 rounded-xl text-sm bg-muted border border-border/50">
                {dish}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">营业时间</span>
            <span>{r.openHours}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">辣度</span>
            <span>{r.spicyLevel}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">适合</span>
            <span>{r.scenarios.join('、')}</span>
          </div>
          {r.isChain && (
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">类型</span>
              <span>连锁品牌</span>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border/50 safe-area-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={handleAddToFortune}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border border-primary text-primary hover:bg-primary/5 transition-colors"
          >
            🏮 加入签筒
          </button>
          <button
            onClick={handleOpenMap}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Navigation className="w-4 h-4" />
            打开地图
          </button>
        </div>
      </div>
    </div>
  );
}

function getCuisineEmoji(cuisine) {
  const map = {
    '中餐': '🍚', '面食': '🍜', '日料': '🍣', '韩餐': '🍱',
    '泰餐': '🍛', '西式': '🍔', '快餐': '🍟', '烧烤': '🔥',
    '麻辣烫': '🌶️', '火锅': '🍲', '串串': '🍢', '奶茶甜品': '🧋',
    '咖啡': '☕', '轻食': '🥗', '台式': '🍱', '港式': '🫖',
    '东北菜': '🥟', '川菜': '🌶️', '湘菜': '🌶️', '新疆菜': '🍖',
    '小龙虾': '🦞', '甜品': '🍰', '面包': '🥐',
  };
  return map[cuisine] || '🍽️';
}
