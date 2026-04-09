import React from 'react';
import { Button } from '../ui/button';
import { Logo } from '../Logo';
import { UserProfile } from '../../types';
import { useAuth } from '../../services/auth/AuthContext';
import { LogIn, User, Globe } from 'lucide-react';
import { useLocalization } from '../../services/localization/LocalizationProvider';

interface PublicLayoutProps {
  children: React.ReactNode;
  user?: UserProfile | null;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onDashboardClick?: () => void;
  onHomeClick?: () => void;
  onBrowseClick?: () => void;
  isLanding?: boolean;
}

export function PublicLayout({ 
  children, 
  user, 
  onLoginClick, 
  onSignupClick,
  onDashboardClick,
  onHomeClick,
  onBrowseClick,
  isLanding = false
}: PublicLayoutProps) {
  const { locale, setLocale, strings } = useLocalization();
  // We can use a simpler translation object for header/footer if needed, 
  // or add these keys to strings.common/public
  
  // Quick local translation helper for header/footer specific items not in global strings yet
  const t = {
    features: locale === 'hi' ? 'विशेषताएँ' : 'Features',
    pricing: locale === 'hi' ? 'मूल्य' : 'Pricing',
    browse: locale === 'hi' ? 'सामग्री देखें' : 'Browse Content',
    login: locale === 'hi' ? 'लॉग इन' : 'Log in',
    getStarted: locale === 'hi' ? 'शुरू करें' : 'Get Started',
    home: locale === 'hi' ? 'होम' : 'Home'
  };

  const toggleLang = () => {
    setLocale(locale === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
              <Logo size="lg" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                ConceptScroll
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {isLanding ? (
                <>
                  <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">{t.features}</a>
                  {onBrowseClick && (
                    <button onClick={onBrowseClick} className="text-gray-600 hover:text-purple-600 transition-colors">
                      {t.browse}
                    </button>
                  )}
                  <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">{t.pricing}</a>
                </>
              ) : (
                <button onClick={onHomeClick} className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t.home}
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleLang}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-purple-600 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-4 h-4" />
                {locale === 'en' ? 'HI' : 'EN'}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={onDashboardClick} className="hidden md:flex hover:text-purple-600">
                    Dashboard
                  </Button>
                  <div 
                    className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium cursor-pointer border-2 border-purple-200"
                    onClick={onDashboardClick}
                  >
                    {user.profile_picture ? (
                      <img 
                        src={user.profile_picture} 
                        alt={user.first_name} 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{user.first_name?.[0] || 'U'}</span>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={onLoginClick}
                    className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    {t.login}
                  </button>
                  <button 
                    onClick={onSignupClick}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30"
                  >
                    {t.getStarted}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Logo size="md" variant="white" />
                <span className="text-xl font-bold">ConceptScroll</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Making education addictive, interactive, and effective for every student in India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} ConceptScroll Education Pvt Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
