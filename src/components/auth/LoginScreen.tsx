import React, { useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { Loader2, Smartphone, Lock, Globe, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onSwitchToSignUp: (phoneNumber?: string) => void;
  onBackToLanding?: () => void;
}

type LoginStep = 'phone' | 'otp';

export function LoginScreen({ onSwitchToSignUp, onBackToLanding }: LoginScreenProps) {
  const { loginWithOTP } = useAuth();
  const { strings, setLocale, locale } = useLocalization();
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState(''); // Empty by default
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  ];

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.substring(0, 10); // Only allow 10 digits for Indian mobile numbers
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setOtp(digits.substring(0, 6));
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (phoneNumber.length !== 10) {
      setError(strings.auth?.invalidPhone || 'Invalid phone');
      return;
    }

    setIsLoading(true);

    try {
      // API expects only 10 digits (no country code prefix)
      console.log('📱 Sending OTP to:', phoneNumber);
      const result = await loginWithOTP.requestOTP(phoneNumber);
      console.log('✅ OTP Request Success:', result.message);
      setStep('otp');
    } catch (err: any) {
      console.error('❌ ❌ OTP Request Error:', err);
      setError(err.message || strings.auth?.failedToSendOTP || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError(strings.auth?.enterValidOTP || 'Enter valid OTP');
      return;
    }

    setIsLoading(true);

    try {
      // API expects only 10 digits (no country code prefix)
      console.log('🔐 Verifying OTP for:', phoneNumber);
      await loginWithOTP.verifyOTP(phoneNumber, otp);
    } catch (err: any) {
      console.error('❌ ❌ OTP Verification Error:', err);
      // If user not found, redirect to signup
      if (err.message === 'USER_NOT_FOUND') {
        // Show info message instead of error, then auto-redirect
        onSwitchToSignUp(phoneNumber);
      } else {
        setError(err.message || strings.auth?.invalidOTP || 'Invalid OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError('');
  };

  const handleLanguageSelect = (langCode: string) => {
    setLocale(langCode as 'en' | 'hi');
    setShowLanguageMenu(false);
  };

  const currentLangName = languages.find(l => l.code === locale)?.nativeName || 'English';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
        {/* Back to Home */}
        {onBackToLanding && (
          <div className="absolute top-4 left-4">
            <button
              onClick={onBackToLanding}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">{currentLangName}</span>
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                    locale === lang.code ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                  }`}
                >
                  <div className="text-sm">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="text-center mb-8 mt-8">
          <div className="inline-block bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-4 mb-4">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-gray-900 mb-2">{strings.auth?.welcome || 'Welcome'}</h1>
          <p className="text-gray-600">{strings.auth?.welcomeSubtitle || 'Learn smarter'}</p>
        </div>

        {/* Phone Number Step */}
        {step === 'phone' && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">{strings.auth?.phoneNumber || 'Phone Number'}</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                  +91
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full pl-20 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="9876543210"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{strings.auth?.phoneNumberHelper || 'We\'ll send you an OTP'}</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{strings.auth?.sendingOTP || 'Sending OTP...'}</span>
                </>
              ) : (
                strings.auth?.sendOTP || 'Send OTP'
              )}
            </button>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <button
              type="button"
              onClick={handleBackToPhone}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">{strings.auth?.changeNumber || 'Change Number'}</span>
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              {strings.auth?.otpSentTo || 'OTP sent to'} +91{phoneNumber}
              <br />
              <span className="text-xs text-blue-600">{strings.auth?.checkConsole || 'Check console'}</span>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">{strings.auth?.enterOTPLabel || 'Enter OTP'}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg tracking-widest text-center"
                  placeholder={strings.auth?.otpPlaceholder || '000000'}
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{strings.auth?.otpHelper || '6 digit code'}</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{strings.auth?.verifying || 'Verifying...'}</span>
                </>
              ) : (
                strings.auth?.verifyAndLogin || 'Verify & Login'
              )}
            </button>

            <button
              type="button"
              onClick={handleRequestOTP}
              disabled={isLoading}
              className="w-full text-purple-600 hover:underline text-sm"
            >
              {strings.auth?.resendOTP || 'Resend OTP'}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">{strings.auth?.or || 'or'}</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {strings.auth?.dontHaveAccount || 'Don\'t have an account?'}{' '}
            <button
              type="button"
              onClick={() => onSwitchToSignUp()}
              className="text-purple-600 hover:underline"
            >
              {strings.auth?.signup || 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}