import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useLocalization } from '../../services/localization/LocalizationProvider';

interface PublicContentLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'hero' | 'default';
  background?: 'gradient' | 'gray';
}

export function PublicContentLayout({
  title,
  subtitle,
  breadcrumbs,
  onBack,
  backLabel,
  loading = false,
  children,
  variant = 'default',
  background = 'gray'
}: PublicContentLayoutProps) {
  const { strings } = useLocalization();
  
  // Hero Variant (Center aligned, larger text, usually for landing pages)
  if (variant === 'hero') {
    return (
      <div className="space-y-8 pb-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-indigo-50 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    );
  }

  // Default Variant (Left aligned, with back button/breadcrumbs)
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className={`${background === 'gradient' ? 'bg-gradient-to-b from-indigo-50 to-white' : 'bg-gray-50 border-b border-gray-200'} py-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          {onBack && (
            <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel || strings.common.back || 'Back'}
            </Button>
          )}
          
          {breadcrumbs && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              {breadcrumbs}
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-lg text-gray-600 mt-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
