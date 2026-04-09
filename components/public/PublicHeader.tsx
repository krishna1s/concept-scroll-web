import React from 'react';
import { Button } from '../ui/button';
import { Logo } from '../Logo';
import { useAuth } from '../../services/auth/AuthContext';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface PublicHeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onDashboardClick?: () => void;
  onHomeClick?: () => void;
  onBrowseClick?: () => void;
  showLandingLinks?: boolean;
}

export function PublicHeader({ 
  onLoginClick, 
  onSignupClick, 
  onDashboardClick, 
  onHomeClick,
  onBrowseClick,
  showLandingLinks = false
}: PublicHeaderProps) {
  const { user } = useAuth();
  const { locale, setLocale, strings } = useLocalization();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = strings.common; // Assuming common strings, but LandingPage had specific ones. 
  // We'll hardcode or use basic strings for now, or expand the strings file.
  
  const toggleLang = () => {
    setLocale(locale === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
            <Logo size="lg" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 hidden sm:block">
              ConceptScroll
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {showLandingLinks && (
              <>
                <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a>
                <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</a>
              </>
            )}
            
            {!showLandingLinks && onBrowseClick && (
                <button onClick={onBrowseClick} className="text-gray-600 hover:text-purple-600 transition-colors">
                  Browse Content
                </button>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-purple-600 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {locale === 'en' ? 'HI' : 'EN'}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onDashboardClick}>
                  Go to Dashboard
                </Button>
                <div 
                  className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium cursor-pointer overflow-hidden border border-indigo-200"
                  onClick={onDashboardClick}
                >
                  {user.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt={user.first_name} 
                      className="h-full w-full object-cover"
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={onSignupClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={toggleLang}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-purple-600 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {locale === 'en' ? 'HI' : 'EN'}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full">
          <div className="flex flex-col space-y-4">
            {showLandingLinks && (
              <>
                <a href="#features" className="text-gray-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                <a href="#pricing" className="text-gray-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
              </>
            )}
            
            {!showLandingLinks && onBrowseClick && (
                <button onClick={() => { onBrowseClick(); setIsMobileMenuOpen(false); }} className="text-left text-gray-600 py-2">
                  Browse Content
                </button>
            )}

            <hr className="border-gray-100" />

            {user ? (
              <Button onClick={() => { onDashboardClick?.(); setIsMobileMenuOpen(false); }} className="w-full justify-start">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => { onLoginClick?.(); setIsMobileMenuOpen(false); }} className="w-full justify-start">
                  Log in
                </Button>
                <Button onClick={() => { onSignupClick?.(); setIsMobileMenuOpen(false); }} className="w-full bg-purple-600 text-white">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
