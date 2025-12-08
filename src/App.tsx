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
import { MOCK_USER } from './services/mock/mockData';
import { debugLogger } from './services/logger/DebugLogger';
import { MobileHeader } from './components/MobileHeader';
import { ConceptScrollLoader } from './components/ui/ConceptScrollLoader';
import { QuizEngine } from './components/QuizEngine';
import { AnswerGrader } from './components/AnswerGrader';
import { Leaderboard } from './components/Leaderboard';
import { ProgressTracker } from './components/ProgressTracker';
import { Library } from './components/Library';

type AuthView = 'landing' | 'login' | 'signup';
export type ViewType = 'feed' | 'dashboard' | 'profile' | 'library' | 'quiz' | 'answer-grader' | 'leaderboard' | 'progress';

function AppContent() {
  const { user, isAuthenticated, isOnboardingComplete, isLoading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [signupPhoneNumber, setSignupPhoneNumber] = useState<string>('');
  
  // Track previous authentication state to detect logout
  const wasAuthenticated = useRef(isAuthenticated);

  // Log auth state changes and handle redirect on logout
  useEffect(() => {
     debugLogger.logAuth(isAuthenticated ? 'Session Active' : 'Session Inactive', user);
     
     // If user was authenticated and now is not, redirect to landing
     if (wasAuthenticated.current && !isAuthenticated) {
        setAuthView('landing');
     }
     
     wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, user]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <ConceptScrollLoader size="lg" />
        <p className="text-gray-500 font-medium animate-pulse">ConceptScroll</p>
      </div>
    );
  }

  // Not authenticated - show landing/login/signup
  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <LandingPage 
          onLogin={() => setAuthView('login')}
          onSignup={() => setAuthView('signup')}
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

  // Construct display user merging real auth data with mock/preferences data
  const displayUser: any = {
    ...MOCK_USER, // Defaults
    ...(user || {}), // Real user data overrides
    
    // Logic: Prefer User Profile fields -> Preferences (legacy) -> Mock
    // Note: We check for board_id/class_id/medium_id as well since backend might return those
    board: user?.board_id || user?.board || preferences?.board_id || (MOCK_USER as any).board || 'CBSE',
    class: user?.class_grade || user?.class_id || user?.class || user?.grade || preferences?.class_id || (MOCK_USER as any).class || '10',
    medium: user?.medium_id || user?.medium || preferences?.medium_id || (MOCK_USER as any).medium || 'English',
    subjects: user?.subjects || preferences?.subject_ids || (MOCK_USER as any).subjects || [],
    
    // Explicitly ensure name is correct if first_name/last_name are present
    name: (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : null) || 
          (user as any)?.name || 
          (MOCK_USER as any).first_name || 
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
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-2">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigate('feed')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
              currentView === 'feed'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-xs">Feed</span>
          </button>

          <button
            onClick={() => handleNavigate('profile')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
              currentView === 'profile'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}