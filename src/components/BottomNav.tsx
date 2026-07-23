import React from 'react';
import { NavigationTab } from '../types';
import { Home, Sparkles, Heart, Settings } from 'lucide-react';

interface BottomNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  favoritesCount,
}) => {
  const tabs = [
    { id: 'home' as NavigationTab, label: 'Home Feed', icon: Home },
    { id: 'predictions' as NavigationTab, label: 'Predictions', icon: Sparkles },
    { id: 'favorites' as NavigationTab, label: 'Favorites', icon: Heart, badge: favoritesCount },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 py-2 px-4 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
