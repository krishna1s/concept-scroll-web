import React from 'react';
import { PublicLayout } from './PublicLayout';
import { PublicContentLanding } from './PublicContentLanding';
import { PublicClasses } from './PublicClasses';
import { PublicClassSubjects } from './PublicClassSubjects';
import { PublicSubjectBooks } from './PublicSubjectBooks';
import { PublicBookChapters } from './PublicBookChapters';
import { UserProfile } from '../../types';

export type PublicRoute = 
  | { page: 'landing'; params?: any }
  | { page: 'classes'; params?: any }
  | { page: 'subjects'; params: { classId: string; className: string } }
  | { page: 'books'; params: { subjectId: string; subjectName: string; classId: string; className: string } }
  | { page: 'chapters'; params: { bookId: string; bookName: string; classId: string; className: string; subjectId: string; subjectName: string } };

interface PublicPageHandlerProps {
  route: PublicRoute;
  user?: UserProfile | null;
  onNavigate: (route: PublicRoute) => void;
  onExit: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onDashboardClick: () => void;
}

export function PublicPageHandler({ 
  route, 
  user, 
  onNavigate, 
  onExit,
  onLoginClick,
  onSignupClick,
  onDashboardClick
}: PublicPageHandlerProps) {

  const renderContent = () => {
    switch (route.page) {
      case 'landing':
        return (
          <PublicContentLanding 
            onSelectCategory={(category) => {
              if (category === 'classes') {
                onNavigate({ page: 'classes' });
              }
            }}
          />
        );

      case 'classes':
        return (
          <PublicClasses 
            onSelectClass={(classId, className) => 
              onNavigate({ page: 'subjects', params: { classId, className } })
            }
          />
        );
      
      case 'subjects':
        return (
          <PublicClassSubjects 
            classId={route.params.classId}
            className={route.params.className}
            onSelectSubject={(subjectId, subjectName) => 
              onNavigate({ 
                page: 'books', 
                params: { 
                  subjectId, 
                  subjectName, 
                  classId: route.params.classId, 
                  className: route.params.className 
                } 
              })
            }
            onBack={() => onNavigate({ page: 'classes' })}
          />
        );

      case 'books':
        return (
          <PublicSubjectBooks 
            subjectId={route.params.subjectId}
            subjectName={route.params.subjectName}
            classId={route.params.classId}
            className={route.params.className}
            onSelectBook={(bookId, bookName) => 
              onNavigate({ 
                page: 'chapters', 
                params: { 
                  bookId, 
                  bookName,
                  subjectId: route.params.subjectId,
                  subjectName: route.params.subjectName,
                  classId: route.params.classId,
                  className: route.params.className
                } 
              })
            }
            onBack={() => onNavigate({ 
              page: 'subjects', 
              params: { 
                classId: route.params.classId, 
                className: route.params.className 
              } 
            })}
          />
        );

      case 'chapters':
        return (
          <PublicBookChapters 
            bookId={route.params.bookId}
            bookName={route.params.bookName}
            onChapterSelect={(chapterId) => {
                // If user is logged in, maybe go to study session?
                // If not, prompt login?
                if (user) {
                    // Navigate to app... but how? 
                    // We probably need a callback to switch to App View
                    // For now, let's just show a login prompt if not logged in
                    onDashboardClick(); // This will go to dashboard, but ideally should deep link
                } else {
                    onLoginClick();
                }
            }}
            onBack={() => onNavigate({ 
              page: 'books', 
              params: { 
                subjectId: route.params.subjectId,
                subjectName: route.params.subjectName,
                classId: route.params.classId,
                className: route.params.className
              } 
            })}
          />
        );
        
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <PublicLayout
      user={user}
      onLoginClick={onLoginClick}
      onSignupClick={onSignupClick}
      onDashboardClick={onDashboardClick}
      onHomeClick={() => onNavigate({ page: 'landing' })}
    >
      {renderContent()}
    </PublicLayout>
  );
}
