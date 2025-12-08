import { ViewType } from '../App';
import { Home, ScrollText, BarChart3, User } from 'lucide-react';

type NavigationProps = {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
};

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  // Hide navigation on feed view for immersive experience
  if (currentView === 'feed') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-around">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'dashboard' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => onNavigate('feed')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'feed' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <ScrollText className="w-6 h-6" />
          <span className="text-xs">Feed</span>
        </button>

        <button
          onClick={() => onNavigate('progress')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'progress' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs">Progress</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'profile' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </nav>
  );
}
