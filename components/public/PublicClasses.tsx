import React, { useEffect, useState } from 'react';
import { Class } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, ArrowRight, Star, Lock } from 'lucide-react';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { PublicContentLayout } from './PublicContentLayout';
import { motion } from 'motion/react';

interface PublicClassesProps {
  onSelectClass: (classId: string, className: string) => void;
}

export function PublicClasses({ onSelectClass }: PublicClassesProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const { strings } = useLocalization();
  const t = strings.public;

  useEffect(() => {
    document.title = t.meta.classesTitle;
    
    // Hardcoded classes as per requirement
    const hardcodedClasses: Class[] = Array.from({ length: 12 }, (_, i) => ({
      id: `class-${i + 1}`,
      name: `Class ${i + 1}`,
      grade_level: (i + 1).toString(),
      board_id: 'default',
      is_active: true
    }));
    
    setClasses(hardcodedClasses);
  }, [t]);

  return (
    <PublicContentLayout
      title={t.title.classes}
      subtitle={t.subtitle.classes}
      variant="hero"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classes.map((cls, index) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-500 relative overflow-hidden bg-white/80 backdrop-blur-sm"
              onClick={() => onSelectClass(cls.id, cls.name)}
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <span className="font-bold text-lg">{cls.grade_level}</span>
                </div>
                {parseInt(cls.grade_level || '0') > 12 ? (
                    <Lock className="h-4 w-4 text-gray-300" />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                    </div>
                )}
              </CardHeader>
              <CardContent className="relative z-10">
                <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                  {cls.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mt-2">
                   <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                   <span>Start Learning</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </PublicContentLayout>
  );
}
