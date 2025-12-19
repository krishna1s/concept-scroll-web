import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './services/auth/AuthContext';
import { ThemeProvider } from './services/theme/ThemeProvider';
import { LocalizationProvider } from './services/localization/LocalizationProvider';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';
import { LandingPage } from './components/LandingPage';
import { HomeFeed } from './components/feed/HomeFeed';
import { Dashboard } from './components/Dashboard';
import { ProfileSettings } from './components/ProfileSettings';
import { debugLogger } from './services/logger/DebugLogger';
import { MobileHeader } from './components/MobileHeader';
import { ConceptScrollLoader } from './components/ui/ConceptScrollLoader';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { SplashScreen } from './components/SplashScreen';
import { QuizEngine } from './components/QuizEngine';
import { AnswerGrader } from './components/AnswerGrader';
import { Leaderboard } from './components/Leaderboard';
import { ProgressTracker } from './components/ProgressTracker';
import { Library } from './components/Library';
import { StudySessionPage } from './components/StudySessionPage';
import { SubscriptionPage } from './components/SubscriptionPage';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { SocialHub } from './components/social/SocialHub';
import { AITutorHub } from './components/ai-tutor/AITutorHub';
import { PublicPageHandler, PublicRoute } from './components/public/PublicPageHandler';
import { Users, Bot } from 'lucide-react';

type AuthView = 'landing' | 'login' | 'signup';
export type ViewType = 'feed' | 'dashboard' | 'profile' | 'library' | 'quiz' | 'answer-grader' | 'leaderboard' | 'progress' | 'study-session' | 'subscription' | 'admin' | 'social' | 'ai-tutor';

function AppContent() {
  const { user, isAuthenticated, isOnboardingComplete, isLoading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [signupPhoneNumber, setSignupPhoneNumber] = useState<string>('');
  const [showSplash, setShowSplash] = useState(true);
  const [publicRoute, setPublicRoute] = useState<PublicRoute | null>(null);
  
  // Track previous authentication state to detect logout
  const wasAuthenticated = useRef(isAuthenticated);

  // Log auth state changes and handle redirect on logout
  useEffect(() => {
     debugLogger.logAuth(isAuthenticated ? 'Session Active' : 'Session Inactive', user);
     
     // If user was authenticated and now is not, redirect to login
     if (wasAuthenticated.current && !isAuthenticated) {
        setAuthView('login');
     }
     
     wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, user]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Handle Public Routes (accessible to both auth and non-auth users)
  if (publicRoute) {
    return (
      <PublicPageHandler 
         route={publicRoute}
         user={user}
         onNavigate={setPublicRoute}
         onExit={() => setPublicRoute(null)}
         onLoginClick={() => { setPublicRoute(null); setAuthView('login'); }}
         onSignupClick={() => { setPublicRoute(null); setAuthView('signup'); }}
         onDashboardClick={() => { setPublicRoute(null); }}
      />
    );
  }

  // Not authenticated - show landing/login/signup
  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <LandingPage 
          onLogin={() => setAuthView('login')}
          onSignup={() => setAuthView('signup')}
          onBrowse={() => setPublicRoute({ page: 'landing' })}
        />
      );
    }
    
    return authView === 'login' ? (
      <LoginScreen 
        onSwitchToSignUp={(phoneNumber) => {
          if (phoneNumber) {
            setSignupPhoneNumber(phoneNumber);
          }
          setAuthView('signup');
        }}
        onBackToLanding={() => setAuthView('landing')}
      />
    ) : (
      <SignUpScreen 
        onSwitchToLogin={() => {
          setSignupPhoneNumber('');
          setAuthView('login');
        }}
        onBackToLanding={() => setAuthView('landing')}
        initialPhoneNumber={signupPhoneNumber}
      />
    );
  }

  // Authenticated but onboarding not complete - show onboarding
  if (!isOnboardingComplete) {
    return <OnboardingScreen />;
  }

  // Fully authenticated and onboarded - show main app
  return <MainApp />;
}

function MainApp() {
  const { user, preferences } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const handleNavigate = (view: ViewType) => {
    debugLogger.logRoute(view, true);
    setCurrentView(view);
  };

  // Construct display user merging real auth data with preferences data
  const displayUser: any = {
    // Defaults from real user data
    ...(user || {}), 
    
    // Logic: Prefer User Profile fields -> Preferences (legacy) -> Defaults
    // Note: We check for board_id/class_id/medium_id as well since backend might return those
    board: user?.board_id || user?.board || preferences?.board_id || 'CBSE',
    class: user?.class_grade || user?.class_id || user?.class || user?.grade || preferences?.class_id || '10',
    medium: user?.medium_id || user?.medium || preferences?.medium_id || 'English',
    subjects: user?.subjects || preferences?.subject_ids || [],
    
    // Explicitly ensure name is correct if first_name/last_name are present
    name: (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : null) || 
          (user as any)?.name || 
          'Student'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        currentView={currentView}
        onSearchClick={() => console.log('Search clicked')}
        onNotificationsClick={() => console.log('Notifications clicked')}
      />

      {/* Main Content */}
      <main 
        className="pt-14 pb-20"
        style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top))' }}
      >
        {currentView === 'feed' && <HomeFeed />}
        {currentView === 'dashboard' && (
          <Dashboard 
            userProfile={displayUser}
            onNavigate={handleNavigate}
            onChapterSelect={(chapter) => console.log('Chapter selected:', chapter)}
          />
        )}
        {currentView === 'profile' && (
          <ProfileSettings 
            userProfile={displayUser}
            updateUserProfile={(updates) => console.log('Update profile:', updates)}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'quiz' && (
          <QuizEngine 
            userProfile={displayUser} 
            onNavigate={handleNavigate}
            updateUserProfile={(updates) => console.log('Update stats:', updates)}
          />
        )}
        {currentView === 'answer-grader' && (
          <AnswerGrader 
            userProfile={displayUser}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'leaderboard' && (
          <Leaderboard 
            userProfile={displayUser}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'progress' && (
          <ProgressTracker 
            userProfile={displayUser}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'library' && (
          <Library onNavigate={handleNavigate} />
        )}
        {currentView === 'study-session' && (
          <StudySessionPage onNavigate={handleNavigate} />
        )}
        {currentView === 'subscription' && (
          <SubscriptionPage onNavigate={handleNavigate} />
        )}
        {currentView === 'admin' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}
        {currentView === 'social' && (
          <SocialHub />
        )}
        {currentView === 'ai-tutor' && (
          <AITutorHub />
        )}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-2">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => handleNavigate('feed')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              currentView === 'feed'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-[10px] font-medium">Feed</span>
          </button>

          <button
            onClick={() => handleNavigate('ai-tutor')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              currentView === 'ai-tutor'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className={`p-1 rounded-full ${currentView === 'ai-tutor' ? 'bg-purple-100' : ''}`}>
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium">Tutor</span>
          </button>

          <button
            onClick={() => handleNavigate('social')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              currentView === 'social'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium">Buddies</span>
          </button>

          <button
            onClick={() => handleNavigate('profile')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              currentView === 'profile'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocalizationProvider>
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
