import React from 'react';
import { Card } from '../ui/card';
import { BookOpen, Book, Newspaper, Palette, Globe, Trophy, Star, ChevronRight, Zap } from 'lucide-react';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { PublicContentLayout } from './PublicContentLayout';
import { motion } from 'motion/react';

interface PublicContentLandingProps {
  onSelectCategory: (category: string) => void;
}

export function PublicContentLanding({ onSelectCategory }: PublicContentLandingProps) {
  const { strings } = useLocalization();
  const t = strings.public;

  const categories = [
    {
      id: 'school_books',
      title: t.categories.schoolBooks,
      desc: t.categories.schoolBooksDesc,
      icon: BookOpen,
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/30',
      action: () => onSelectCategory('classes'),
      locked: false,
      level: 1,
      xp: '1000 XP'
    },
    {
      id: 'novels',
      title: t.categories.novels,
      desc: t.categories.novelsDesc,
      icon: Book,
      gradient: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/30',
      action: () => {},
      locked: true,
      level: 5,
      xp: '2500 XP'
    },
    {
      id: 'comics',
      title: t.categories.comics,
      desc: t.categories.comicsDesc,
      icon: Palette,
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-orange-500/30',
      action: () => {},
      locked: true,
      level: 8,
      xp: '3000 XP'
    },
    {
      id: 'magazines',
      title: t.categories.magazines,
      desc: t.categories.magazinesDesc,
      icon: Newspaper,
      gradient: 'from-rose-400 to-red-500',
      shadow: 'shadow-red-500/30',
      action: () => {},
      locked: true,
      level: 10,
      xp: '4500 XP'
    },
    {
      id: 'gk',
      title: t.categories.generalKnowledge,
      desc: t.categories.generalKnowledgeDesc,
      icon: Globe,
      gradient: 'from-emerald-400 to-green-600',
      shadow: 'shadow-green-500/30',
      action: () => {},
      locked: true,
      level: 12,
      xp: '5000 XP'
    },
    {
      id: 'competitive',
      title: t.categories.competitive,
      desc: t.categories.competitiveDesc,
      icon: Trophy,
      gradient: 'from-cyan-400 to-blue-500',
      shadow: 'shadow-cyan-500/30',
      action: () => {},
      locked: true,
      level: 15,
      xp: '10000 XP'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner with Game Theme */}
      <div className="relative bg-[#1a1b2e] text-white overflow-hidden pb-32 pt-12">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium text-purple-200 mb-6">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>Level Up Your Knowledge</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Battleground</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Choose a category to start your learning journey. Unlock new worlds as you progress!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cards Grid - Overlapping the banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div 
                onClick={category.action}
                className={`relative group h-full cursor-pointer rounded-2xl p-1 transition-all duration-300 hover:-translate-y-1 ${category.locked ? 'opacity-80 grayscale-[0.5] hover:grayscale-0' : ''}`}
              >
                {/* Border Gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}></div>
                
                {/* Card Content */}
                <div className="relative h-full bg-white rounded-xl p-6 shadow-xl border border-gray-100 overflow-hidden">
                  {/* Background Decoration */}
                  <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${category.gradient} opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-lg ${category.shadow} group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    {category.locked ? (
                       <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                         Locked <span className="text-xs ml-1">🔒</span>
                       </div>
                    ) : (
                       <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                         Active <span className="h-2 w-2 rounded-full bg-green-500 ml-1 animate-pulse"></span>
                       </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm line-clamp-2">
                    {category.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Reward</span>
                      <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500" /> {category.xp}
                      </span>
                    </div>
                    
                    <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${category.locked ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white group-hover:bg-purple-600'}`}>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
