import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Download, Star, School, Trophy, Users } from 'lucide-react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    title: 'Ready to start learning?',
    subtitle: 'Join India\'s fastest growing student community. Download the app today!',
    appStore: 'App Store',
    playStore: 'Play Store',
    stats: {
        users: 'Daily Active Users',
        schools: 'Schools Connected',
        battles: 'Quiz Battles Daily',
        rating: 'App Store Rating'
    }
  },
  hi: {
    title: 'सीखना शुरू करने के लिए तैयार हैं?',
    subtitle: 'भारत के सबसे तेजी से बढ़ते छात्र समुदाय में शामिल हों। आज ही ऐप डाउनलोड करें!',
    appStore: 'ऐप स्टोर',
    playStore: 'प्ले स्टोर',
    stats: {
        users: 'दैनिक सक्रिय उपयोगकर्ता',
        schools: 'जुड़े हुए स्कूल',
        battles: 'दैनिक क्विज़ बैटल',
        rating: 'ऐप स्टोर रेटिंग'
    }
  }
};

export const CtaSection = ({ lang, onSignup }: { lang: Language, onSignup: () => void }) => {
  const t = translations[lang];
  
  return (
    <section className="py-32 relative overflow-hidden bg-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/30 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/30 rounded-full blur-[120px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.title}
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-purple-100 mb-12 font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.subtitle}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={onSignup}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-900/20"
            >
              <Smartphone className="w-6 h-6" />
              <span>{t.appStore}</span>
            </button>
            <button 
              onClick={onSignup}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-6 h-6" />
              <span>{t.playStore}</span>
            </button>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <Users className="w-6 h-6 text-purple-300 mb-3 mx-auto" />
              <div className="text-3xl font-bold mb-1">10k+</div>
              <div className="text-purple-200 text-sm font-medium">{t.stats.users}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <School className="w-6 h-6 text-blue-300 mb-3 mx-auto" />
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-purple-200 text-sm font-medium">{t.stats.schools}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <Trophy className="w-6 h-6 text-orange-300 mb-3 mx-auto" />
              <div className="text-3xl font-bold mb-1">25k+</div>
              <div className="text-purple-200 text-sm font-medium">{t.stats.battles}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <Star className="w-6 h-6 text-yellow-300 mb-3 mx-auto" />
              <div className="text-3xl font-bold mb-1">4.8★</div>
              <div className="text-purple-200 text-sm font-medium">{t.stats.rating}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
