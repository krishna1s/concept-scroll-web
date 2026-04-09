import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Brain, Trophy, CheckCircle2, Flame, ChevronRight, Star } from 'lucide-react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    title: 'How ConceptScroll Works',
    subtitle: 'Everything you need to master your syllabus in one app.',
    steps: [
      {
        id: 'goals',
        title: 'Set Daily Goals',
        desc: 'Choose a subject and chapter to focus on today.',
        icon: Target
      },
      {
        id: 'quiz',
        title: 'Take Quizzes',
        desc: 'Test your knowledge with quick, bite-sized quizzes.',
        icon: Brain
      },
      {
        id: 'rewards',
        title: 'Earn Rewards',
        desc: 'Get XP, badges, and climb the leaderboard.',
        icon: Trophy
      }
    ]
  },
  hi: {
    title: 'ConceptScroll कैसे काम करता है',
    subtitle: 'एक ही ऐप में अपना सिलेबस पूरा करने के लिए सब कुछ।',
    steps: [
      {
        id: 'goals',
        title: 'दैनिक लक्ष्य निर्धारित करें',
        desc: 'आज ध्यान केंद्रित करने के लिए एक विषय और अध्याय चुनें।',
        icon: Target
      },
      {
        id: 'quiz',
        title: 'क्विज़ लें',
        desc: 'त्वरित, छोटे क्विज़ के साथ अपने ज्ञान का परीक्षण करें।',
        icon: Brain
      },
      {
        id: 'rewards',
        title: 'पुरस्कार जीतें',
        desc: 'XP, बैज प्राप्त करें और लीडरबोर्ड पर चढ़ें।',
        icon: Trophy
      }
    ]
  }
};

export const DemoWalkthroughSection = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle through steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % t.steps.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, [t.steps.length]);

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Steps Navigation */}
          <div className="space-y-4">
            {t.steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 flex items-start gap-4 ${
                  activeStep === index 
                    ? 'bg-white shadow-lg scale-105 border-l-4 border-purple-600' 
                    : 'bg-transparent hover:bg-white/50 border-l-4 border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <div className={`p-3 rounded-xl ${activeStep === index ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${activeStep === index ? 'text-gray-900' : 'text-gray-700'}`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Phone Animation */}
          <div className="relative mx-auto lg:mr-0">
             {/* Phone Bezel */}
            <div className="w-[320px] h-[640px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl relative z-10 border-[6px] border-gray-800 ring-1 ring-gray-700">
               {/* Screen Content */}
               <div className="w-full h-full bg-gray-50 rounded-[2.2rem] overflow-hidden relative">
                 {/* Top Status Bar Placeholder */}
                 <div className="h-6 bg-white w-full absolute top-0 z-20 flex justify-between px-6 items-center">
                    <div className="w-12 h-3 bg-gray-100 rounded-full"></div>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    </div>
                 </div>

                 <AnimatePresence mode="wait">
                    {activeStep === 0 && <GoalAnimation key="goals" />}
                    {activeStep === 1 && <QuizAnimation key="quiz" />}
                    {activeStep === 2 && <RewardsAnimation key="rewards" />}
                 </AnimatePresence>
               </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200 to-blue-200 rounded-full blur-[100px] -z-10 opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Animation Components ---

const GoalAnimation = () => {
  return (
    <motion.div 
      className="w-full h-full bg-white pt-10 px-4 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full text-left mb-6">
        <h3 className="font-bold text-xl text-gray-800">Hello, Student! 👋</h3>
        <p className="text-gray-500 text-sm">Ready to learn today?</p>
      </div>

      {/* Goal Card Animation */}
      <motion.div 
        className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-5 overflow-hidden relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
           <div>
              <div className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block mb-1">DAILY GOAL</div>
              <h4 className="font-bold text-gray-900">Mathematics</h4>
              <p className="text-xs text-gray-500">Chapter 1: Real Numbers</p>
           </div>
           <div className="p-2 bg-gray-50 rounded-full">
              <Target className="w-5 h-5 text-gray-400" />
           </div>
        </div>

        {/* Progress Bar Animation */}
        <div className="relative pt-2">
           <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
              <span>Progress</span>
              <motion.span
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1.5 }}
              >
                 75%
              </motion.span>
           </div>
           <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
              />
           </div>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        className="mt-6 w-full py-3 bg-purple-600 text-white rounded-xl font-semibold text-center shadow-lg shadow-purple-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Continue Learning
      </motion.div>

      {/* Streak Floating Element */}
      <motion.div
         className="mt-8 flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold text-sm border border-orange-100"
         initial={{ y: 10, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 2.5 }}
      >
         <Flame className="w-4 h-4 fill-orange-500" /> 5 Day Streak!
      </motion.div>
    </motion.div>
  );
};

const QuizAnimation = () => {
    const [selected, setSelected] = useState<number | null>(null);
  
    useEffect(() => {
        const timer = setTimeout(() => setSelected(1), 1500); // Select correct answer after 1.5s
        return () => clearTimeout(timer);
    }, []);
  
    return (
      <motion.div 
        className="w-full h-full bg-indigo-50 pt-10 px-4 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
         {/* Quiz Card */}
         <div className="w-full bg-white rounded-2xl shadow-xl p-5 mt-4">
             <div className="flex justify-between items-center mb-4">
                 <span className="text-xs font-bold text-gray-400">SCIENCE QUIZ</span>
                 <span className="text-xs font-bold text-indigo-600">Q 1/5</span>
             </div>
             
             <h4 className="font-bold text-gray-900 mb-6 text-lg leading-tight">
                 What is the powerhouse of the cell?
             </h4>
  
             <div className="space-y-3">
                 {['Nucleus', 'Mitochondria', 'Ribosome'].map((opt, i) => (
                     <motion.div 
                        key={i}
                        className={`p-3 rounded-xl border-2 font-medium text-sm transition-colors flex justify-between items-center ${
                            selected === i 
                                ? 'bg-green-50 border-green-500 text-green-700' 
                                : 'bg-white border-gray-100 text-gray-600'
                        }`}
                        animate={selected === i ? { scale: 1.02 } : { scale: 1 }}
                     >
                        {opt}
                        {selected === i && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                     </motion.div>
                 ))}
             </div>
  
             {selected !== null && (
                 <motion.div 
                    className="mt-4 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                 >
                     <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                         Correct! +10 XP
                     </div>
                 </motion.div>
             )}
         </div>
      </motion.div>
    );
  };

  const RewardsAnimation = () => {
    return (
      <motion.div 
        className="w-full h-full bg-gradient-to-b from-purple-600 to-indigo-800 pt-10 px-4 flex flex-col items-center text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Confetti (Simplified) */}
        {[...Array(10)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{ 
                    top: -10, 
                    left: Math.random() * 300 
                }}
                animate={{ 
                    top: 600,
                    rotate: 360 
                }}
                transition={{ 
                    duration: 3 + Math.random() * 2, 
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        ))}

        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="mt-12 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 mb-6"
        >
            <Trophy className="w-12 h-12 text-yellow-800" />
        </motion.div>

        <motion.h3 
            className="text-2xl font-bold mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
        >
            Level Up!
        </motion.h3>
        
        <motion.p 
            className="text-purple-200 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            You reached Level 5 Scholar
        </motion.p>

        {/* Leaderboard Snippet */}
        <motion.div 
            className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
        >
            <h4 className="text-sm font-bold mb-3 text-purple-200 uppercase tracking-wider">Top Learners</h4>
            <div className="space-y-3">
                {[
                    { name: 'You', xp: '1,250', rank: 1, active: true },
                    { name: 'Rahul K.', xp: '1,100', rank: 2, active: false },
                    { name: 'Sarah M.', xp: '980', rank: 3, active: false },
                ].map((user, i) => (
                    <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${user.active ? 'bg-white/20 border border-white/30' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                {user.rank}
                            </div>
                            <span className="text-sm font-medium">{user.name}</span>
                        </div>
                        <span className="text-xs font-bold text-yellow-300">{user.xp} XP</span>
                    </div>
                ))}
            </div>
        </motion.div>
      </motion.div>
    );
  };
