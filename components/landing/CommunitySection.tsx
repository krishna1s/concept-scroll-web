import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Flame, Share2, ArrowRight } from 'lucide-react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    title: 'Join the Community',
    subtitle: 'Join exciting challenges, compete with peers, and showcase your academic achievements.',
    challenges: [
      {
        title: "Board Exam Toppers",
        description: "Compete against the top performers in your board exams and see if you can match their scores!",
        participants: 5432,
      },
      {
        title: "90% Club",
        description: "Join the elite students who consistently score 90% or above in daily quizzes.",
        participants: 3214,
      },
      {
        title: "Streak Masters",
        description: "Keep your learning streaks alive for 30 days straight and earn exclusive rewards!",
        participants: 7845,
      },
    ],
    labels: {
        participants: 'participants',
        join: 'Join',
        share: 'Share Score',
        yourScore: 'Your Score',
        shareTitle: 'Share your achievements!',
        shareDesc: 'Show off your learning progress and quiz scores with friends and classmates.'
    }
  },
  hi: {
    title: 'समुदाय में शामिल हों',
    subtitle: 'रोमांचक चुनौतियों में शामिल हों, साथियों के साथ प्रतिस्पर्धा करें और अपनी शैक्षणिक उपलब्धियों का प्रदर्शन करें।',
    challenges: [
      {
        title: "बोर्ड परीक्षा टॉपर्स",
        description: "अपनी बोर्ड परीक्षाओं में सर्वश्रेष्ठ प्रदर्शन करने वालों के खिलाफ प्रतिस्पर्धा करें!",
        participants: 5432,
      },
      {
        title: "90% क्लब",
        description: "उन विशिष्ट छात्रों में शामिल हों जो दैनिक क्विज़ में लगातार 90% या उससे अधिक स्कोर करते हैं।",
        participants: 3214,
      },
      {
        title: "स्ट्रीक मास्टर्स",
        description: "लगातार 30 दिनों तक अपनी सीखने की स्ट्रीक जारी रखें और विशेष पुरस्कार जीतें!",
        participants: 7845,
      },
    ],
    labels: {
        participants: 'प्रतिभागी',
        join: 'शामिल हों',
        share: 'स्कोर साझा करें',
        yourScore: 'आपका स्कोर',
        shareTitle: 'अपनी उपलब्धियों को साझा करें!',
        shareDesc: 'दोस्तों और सहपाठियों के साथ अपनी सीखने की प्रगति और क्विज़ स्कोर दिखाएं।'
    }
  }
};

interface ChallengeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  participants: number;
  gradient: string;
  index: number;
  t: typeof translations['en'];
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  icon, title, description, participants, gradient, index, t
}) => {
  return (
    <motion.div 
      className={`rounded-3xl p-8 text-white overflow-hidden relative ${gradient} shadow-lg hover:shadow-xl transition-shadow`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      
      <div className="flex items-start gap-6 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-white/90 mb-6 leading-relaxed text-sm opacity-90">{description}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="font-bold">{participants.toLocaleString()}</span> {t.labels.participants}
            </div>
            
            <div className="flex gap-2">
              <button 
                className="px-5 py-2 text-sm font-bold rounded-xl bg-white text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
              >
                {t.labels.join}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CommunitySection = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  
  const challenges = [
    {
      icon: <Trophy size={28} />,
      title: t.challenges[0].title,
      description: t.challenges[0].description,
      participants: t.challenges[0].participants,
      gradient: "bg-gradient-to-br from-purple-600 to-indigo-700",
    },
    {
      icon: <Medal size={28} />,
      title: t.challenges[1].title,
      description: t.challenges[1].description,
      participants: t.challenges[1].participants,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
    },
    {
      icon: <Flame size={28} />,
      title: t.challenges[2].title,
      description: t.challenges[2].description,
      participants: t.challenges[2].participants,
      gradient: "bg-gradient-to-br from-orange-500 to-red-600",
    },
  ];
  
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={index}
              icon={challenge.icon}
              title={challenge.title}
              description={challenge.description}
              participants={challenge.participants}
              gradient={challenge.gradient}
              index={index}
              t={t}
            />
          ))}
        </div>
        
        <motion.div 
          className="bg-gray-50 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center border-4 border-transparent">
                        <div className="text-5xl font-black bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">93%</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t.labels.yourScore}</div>
                    </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-4 text-gray-900">{t.labels.shareTitle}</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t.labels.shareDesc}</p>
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-lg">
                <Share2 className="w-5 h-5" />
                {t.labels.share}
                <ArrowRight className="w-5 h-5 ml-2 opacity-50" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
