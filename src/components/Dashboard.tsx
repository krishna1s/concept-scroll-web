import { UserProfile, DashboardData, QuickAction } from '../types';
import { Flame, Trophy, Target, BookOpen, Brain, Zap, Clock, TrendingUp, Library as LibraryIcon, Layout, Star, ChevronRight } from 'lucide-react';
import { t } from '../strings';
import { apiClient } from '../services/api';
import { useState, useEffect } from 'react';
import { ViewType } from '../App';
import { DailyGoalWidget } from './dashboard/DailyGoalWidget';
import { Loader2 } from 'lucide-react';

type DashboardProps = {
  userProfile: any;
  onNavigate: (view: ViewType) => void;
  onChapterSelect: (chapter: any) => void;
};

export function Dashboard({ userProfile, onNavigate, onChapterSelect }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lang = 'en';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await apiClient.getDashboardOverview();
        setData(dashboardData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("Failed to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'concept_feed': onNavigate('feed'); break;
      case 'daily_quiz': onNavigate('quiz'); break;
      case 'ai_grader': onNavigate('answer-grader'); break;
      case 'leaderboard': onNavigate('leaderboard'); break;
      default: console.warn('Unknown action:', actionId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
     return (
       <div className="p-8 text-center text-red-500">
         <p>{error || "Something went wrong"}</p>
         <button onClick={() => window.location.reload()} className="mt-4 text-purple-600 underline">Retry</button>
       </div>
     );
  }

  const { stats, daily_goal, user, quick_actions, badges, subscription, learning_progress } = data;

  return (
    <div className="px-4 pt-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold">
            {t(lang, 'dashboard.hello').replace('{name}', user.first_name || user.username || 'Student')}
          </h1>
          <p className="text-gray-600">{t(lang, 'dashboard.readyToLearn')}</p>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-100">
            <img src={user.profile_picture || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Streak Card */}
        <div 
          onClick={() => onNavigate('progress')}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <Flame className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <Flame className="w-6 h-6" />
            <span className="font-medium">{t(lang, 'dashboard.days')}</span>
          </div>
          <div className="mb-1 text-3xl font-bold relative z-10">{stats.days_streak}</div>
          <p className="text-sm opacity-90 relative z-10">{t(lang, 'dashboard.streakCount')}</p>
        </div>

        {/* XP Card */}
        <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <Zap className="w-6 h-6" />
            <span className="font-medium">{t(lang, 'dashboard.xp')}</span>
          </div>
          <div className="mb-1 text-3xl font-bold">{stats.xp_points}</div>
          <p className="text-sm opacity-90 relative z-10">{t(lang, 'dashboard.totalPoints')}</p>
        </div>

        {/* Level Card */}
        <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <Trophy className="w-6 h-6" />
            <span className="font-medium">{t(lang, 'dashboard.level')}</span>
          </div>
          <div className="mb-1 text-3xl font-bold">{stats.level}</div>
          <p className="text-sm opacity-90 relative z-10">{t(lang, 'dashboard.currentLevel')}</p>
        </div>

        {/* Library Card */}
        <div 
          onClick={() => onNavigate('library')}
          className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl p-5 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <LibraryIcon className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <LibraryIcon className="w-6 h-6" />
            <span className="font-medium">Library</span>
          </div>
          <div className="mb-1 text-3xl font-bold">{stats.library_items}</div>
          <p className="text-sm opacity-90 relative z-10">Saved Items</p>
        </div>
      </div>

      {/* Daily Goal Widget - passing real data if compatible or using simpler display */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">{daily_goal.title || "Daily Goal"}</h3>
              <span className="text-xs font-medium text-gray-500">{daily_goal.current}/{daily_goal.target}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500" 
                  style={{ width: `${daily_goal.progress_percentage}%` }}
              />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">{daily_goal.progress_percentage}% Completed</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="mb-4 font-bold text-gray-900">{t(lang, 'dashboard.quickActions')}</h2>
        <div className="grid grid-cols-2 gap-4">
          {quick_actions.map(action => (
             <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className="bg-white border border-gray-100 text-gray-800 rounded-2xl p-5 text-left hover:shadow-md transition-all active:scale-95 flex flex-col gap-3"
             >
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-xl">
                    {action.icon} 
                    {/* Note: if icon is an emoji string from backend, this works. If it's a URL or icon name, we might need a mapper */}
                </div>
                <div>
                   <div className="font-bold">{action.title}</div>
                   <div className="text-xs text-gray-500">Tap to open</div>
                </div>
             </button>
          ))}
        </div>
      </div>

      {/* Learning Progress (if available) */}
      {learning_progress && learning_progress.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{t(lang, 'dashboard.continueLearning')}</h2>
            <button className="text-purple-600 text-sm hover:underline">{t(lang, 'dashboard.viewAll')}</button>
          </div>
          <div className="space-y-3">
            {learning_progress.map((item: any, idx) => (
              <button
                key={idx}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-2">
                   <span className="font-medium text-gray-900">{item.subject || "Subject"}</span>
                   <span className="text-xs text-gray-500">{item.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500" style={{ width: `${item.progress}%` }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Achievements / Badges */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">{t(lang, 'dashboard.achievements')}</h2>
          <button className="text-purple-600 text-sm hover:underline" onClick={() => onNavigate('profile')}>
              {t(lang, 'dashboard.viewAll')}
          </button>
        </div>
        
        {badges.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
            {badges.slice(0, 4).map((badge, index) => (
                <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm flex flex-col items-center gap-2"
                >
                <div className="text-2xl">{badge.icon || "🏆"}</div>
                <p className="text-[10px] font-medium leading-tight line-clamp-2">{badge.name}</p>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500">Start learning to earn badges!</p>
            </div>
        )}
      </div>

      {/* Subscription Banner */}
      {subscription && subscription.status !== 'active' && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold">{t(lang, 'dashboard.upgradeToPremium')}</span>
              </div>
              <p className="text-sm opacity-90 mb-4 max-w-sm">
                {t(lang, 'dashboard.unlockUnlimited')}
              </p>
              <button
                onClick={() => onNavigate('profile')}
                className="bg-white text-purple-600 px-6 py-2.5 rounded-xl font-medium hover:bg-purple-50 transition-colors shadow-sm"
              >
                {t(lang, 'dashboard.viewPlans')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
