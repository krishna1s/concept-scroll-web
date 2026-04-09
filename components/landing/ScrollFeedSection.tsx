import React from 'react';
import { motion } from 'motion/react';
import { Flame, Zap, Medal, Heart, MessageCircle, Bookmark } from 'lucide-react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    title: 'Your Study Feed',
    subtitle: 'Like Instagram Reels, but for learning. Scroll through concepts, quizzes, and facts.',
    cards: {
      history: {
        title: 'History Fact',
        desc: 'The Great Wall of China took over 2,000 years to build.',
        tag: '#History'
      },
      science: {
        title: 'Science Concept',
        desc: 'Photosynthesis converts light energy into chemical energy.',
        tag: '#Science'
      },
      math: {
        title: 'Math Formula',
        desc: 'The quadratic formula solves ax² + bx + c = 0',
        tag: '#Math'
      }
    },
    quiz: {
      title: 'Quick Quiz',
      question: 'What is the capital of France?',
      options: ['London', 'Paris', 'Berlin', 'Madrid']
    },
    challenge: {
      title: '7-Day Challenge',
      desc: 'Complete daily science quizzes for 7 days to earn a special badge!',
      join: 'Join Challenge'
    },
    features: {
      streaks: {
        title: 'Daily Streaks',
        desc: 'Build daily study habits. The longer you keep at it, the more rewards you unlock.'
      },
      xp: {
        title: 'XP Points',
        desc: 'Earn XP for every concept you learn. Level up your profile.'
      },
      leaderboard: {
        title: 'Leaderboards',
        desc: 'Compete with friends and classmates on subject leaderboards.'
      }
    }
  },
  hi: {
    title: 'आपका स्टडी फीड',
    subtitle: 'इंस्टाग्राम रील्स जैसा, लेकिन पढ़ाई के लिए। कॉन्सेप्ट्स, क्विज़ और तथ्यों को स्क्रॉल करें।',
    cards: {
      history: {
        title: 'इतिहास तथ्य',
        desc: 'चीन की महान दीवार को बनने में 2,000 साल से अधिक समय लगा।',
        tag: '#इतिहास'
      },
      science: {
        title: 'विज्ञान अवधारणा',
        desc: 'प्रकाश संश्लेषण प्रकाश ऊर्जा को रासायनिक ऊर्जा में परिवर्तित करता है।',
        tag: '#विज्ञान'
      },
      math: {
        title: 'गणित सूत्र',
        desc: 'द्विघात सूत्र ax² + bx + c = 0 को हल करता है',
        tag: '#गणित'
      }
    },
    quiz: {
      title: 'त्वरित क्विज़',
      question: 'फ्रांस की राजधानी क्या है?',
      options: ['लंदन', 'पेरिस', 'बर्लिन', 'मैड्रिड']
    },
    challenge: {
      title: '7-दिवसीय चुनौती',
      desc: 'एक विशेष बैज अर्जित करने के लिए 7 दिनों तक दैनिक विज्ञान क्विज़ पूरा करें!',
      join: 'चुनौती में शामिल हों'
    },
    features: {
      streaks: {
        title: 'दैनिक स्ट्रीक्स',
        desc: 'रोजाना पढ़ाई की आदतें बनाएं। जितना लंबा आप इसे बनाए रखेंगे, उतने अधिक पुरस्कार अनलॉक करेंगे।'
      },
      xp: {
        title: 'XP अंक',
        desc: 'हर सीखे गए कॉन्सेप्ट के लिए XP कमाएं। अपना प्रोफाइल लेवल बढ़ाएं।'
      },
      leaderboard: {
        title: 'लीडरबोर्ड',
        desc: 'विषय लीडरबोर्ड पर दोस्तों और सहपाठियों के साथ प्रतिस्पर्धा करें।'
      }
    }
  }
};

export const ScrollFeedSection = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  
  // Staggered animation for cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.title}
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.subtitle}
          </motion.p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2">
            <motion.div 
              className="relative overflow-hidden max-w-sm mx-auto lg:mr-0"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Scrolling feed simulation */}
              <div className="h-[600px] overflow-hidden rounded-[2.5rem] border-8 border-gray-900 shadow-2xl relative bg-gray-100 ring-1 ring-gray-900/10">
                {/* Status bar */}
                <div className="h-8 w-full bg-gray-900 flex items-center justify-between px-6 z-10 relative">
                  <div className="w-16 h-1 bg-gray-700 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="relative h-full overflow-hidden">
                  {/* Animated scrolling feed */}
                  <div className="animate-scroll-y flex flex-col gap-4 p-3 absolute w-full">
                    {/* Concept Cards that repeat */}
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white bg-gradient-to-br ${
                            index % 3 === 0 ? 'from-orange-400 to-red-500' : 
                            index % 3 === 1 ? 'from-blue-400 to-indigo-500' : 
                            'from-green-400 to-teal-500'
                          }`}>
                            <span className="text-xl">
                                {index % 3 === 0 ? '📜' : index % 3 === 1 ? '🧬' : '📐'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm">
                                {index % 3 === 0 ? t.cards.history.title : 
                                 index % 3 === 1 ? t.cards.science.title : 
                                 t.cards.math.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                              {index % 3 === 0 ? t.cards.history.desc : 
                               index % 3 === 1 ? t.cards.science.desc : 
                               t.cards.math.desc}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-3">
                                <Heart className="w-4 h-4 text-gray-400" />
                                <MessageCircle className="w-4 h-4 text-gray-400" />
                                <Bookmark className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                {index % 3 === 0 ? t.cards.history.tag : 
                                 index % 3 === 1 ? t.cards.science.tag : 
                                 t.cards.math.tag}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quiz inserted */}
                  <motion.div 
                    animate={{ y: [10, 0, 10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[180px] left-3 right-3"
                  >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
                      <div className="bg-purple-600 text-white p-4">
                        <h4 className="font-bold text-sm">{t.quiz.title}</h4>
                        <p className="text-xs opacity-90 mt-1">{t.quiz.question}</p>
                      </div>
                      <div className="p-3 space-y-2 bg-purple-50/50">
                        {t.quiz.options.map((opt, i) => (
                            <div key={i} className={`p-2 rounded-lg text-xs font-medium border ${i === 1 ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                                {opt}
                            </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Challenge card */}
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[80px] left-3 right-3"
                  >
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
                          🏆
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{t.challenge.title}</h4>
                          <p className="text-xs text-white/90 mt-1 leading-relaxed">{t.challenge.desc}</p>
                          <button className="mt-3 bg-white text-orange-600 font-bold text-xs rounded-full px-4 py-1.5 shadow-sm">
                            {t.challenge.join}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <motion.div 
              className="space-y-10"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={item} className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{t.features.streaks.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{t.features.streaks.desc}</p>
                </div>
              </motion.div>
              
              <motion.div variants={item} className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{t.features.xp.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{t.features.xp.desc}</p>
                </div>
              </motion.div>
              
              <motion.div variants={item} className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Medal className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{t.features.leaderboard.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{t.features.leaderboard.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-y {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-y {
          animation: scroll-y 20s linear infinite;
        }
      `}</style>
    </section>
  );
};
