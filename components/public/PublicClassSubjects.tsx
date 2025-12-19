import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { Subject } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Book, Beaker, Calculator, Globe, PenTool } from 'lucide-react';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { PublicContentLayout } from './PublicContentLayout';

interface PublicClassSubjectsProps {
  classId: string;
  className: string;
  onSelectSubject: (subjectId: string, subjectName: string) => void;
  onBack: () => void;
}

export function PublicClassSubjects({ classId, className, onSelectSubject, onBack }: PublicClassSubjectsProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { strings } = useLocalization();
  const t = strings.public;

  useEffect(() => {
    document.title = t.meta.subjectsTitle.replace('{className}', className);
    const loadSubjects = async () => {
      try {
        const data = await apiClient.getPublicSubjects(classId);
        setSubjects(data);
      } catch (error) {
        console.error('Failed to load subjects', error);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, [classId, className, t]);

  const getIconForSubject = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return <Calculator className="h-6 w-6" />;
    if (n.includes('science') || n.includes('phys') || n.includes('chem') || n.includes('bio')) return <Beaker className="h-6 w-6" />;
    if (n.includes('social') || n.includes('history') || n.includes('geo')) return <Globe className="h-6 w-6" />;
    if (n.includes('english') || n.includes('hindi')) return <PenTool className="h-6 w-6" />;
    return <Book className="h-6 w-6" />;
  };

  const getGradientForSubject = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return 'from-blue-500 to-cyan-500';
    if (n.includes('science')) return 'from-emerald-500 to-teal-500';
    if (n.includes('history') || n.includes('social')) return 'from-orange-500 to-amber-500';
    if (n.includes('english')) return 'from-pink-500 to-rose-500';
    return 'from-indigo-500 to-violet-500';
  };

  return (
    <PublicContentLayout
      title={`${className} ${t.title.subjects}`}
      subtitle={t.subtitle.subjects}
      onBack={onBack}
      backLabel={t.actions.backToClasses}
      loading={loading}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card 
            key={subject.id} 
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-md ring-1 ring-gray-200"
            onClick={() => onSelectSubject(subject.id, subject.name)}
          >
            <div className={`h-2 bg-gradient-to-r ${getGradientForSubject(subject.name)}`} />
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gray-50 text-gray-700 group-hover:scale-110 transition-transform duration-300`}>
                  {getIconForSubject(subject.name)}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                {subject.name}
              </h3>
              <p className="text-sm text-gray-500">
                {subject.medium ? `${subject.medium} ${t.labels.medium}` : 'Standard Curriculum'}
              </p>
            </CardContent>
          </Card>
        ))}
        
        {subjects.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
                {t.empty.noSubjects}
            </div>
        )}
      </div>
    </PublicContentLayout>
  );
}
