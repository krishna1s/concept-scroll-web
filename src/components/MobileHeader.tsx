import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useLocalization } from '../services/localization/LocalizationProvider';
import { ViewType } from '../App';
import { Logo } from './Logo';

interface MobileHeaderProps {
  currentView: ViewType;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
}

export function MobileHeader({ 
  currentView, 
  onMenuClick, 
  onSearchClick, 
  onNotificationsClick 
}: MobileHeaderProps) {
  const { strings } = useLocalization();

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return strings.common.navDashboard;
      case 'feed':
        return strings.common.navHome; // Or 'Feed'
      case 'profile':
        return strings.common.profile;
      case 'library':
        return strings.common.appName;
      case 'quiz':
        return strings.common.navQuizArena;
      case 'answer-grader':
        return strings.common.navFocus; // Assuming this maps closely
      case 'leaderboard':
        return strings.common.navStreaks; // Approximate mapping
      default:
        return strings.common.appName;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm safe-area-top">
      {/* 
        The 'safe-area-top' class should handle the padding-top for the notch.
        If it's not defined in global styles, we apply the style manually.
      */}
      <div 
        className="h-14 flex items-center justify-between px-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Logo size="md" />
          {/* Logo or App Name */}
          <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {currentView === 'dashboard' ? strings.common.appName : getTitle()}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onSearchClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onNotificationsClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
