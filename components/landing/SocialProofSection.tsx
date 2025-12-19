import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    title: 'Loved by Students',
    count: 'Join 10,000+ students learning smarter',
    testimonials: [
      {
        quote: "ConceptScroll changed how I revise. It's like scrolling Instagram but I actually learn something!",
        name: 'Rahul K.',
        badge: 'Science Champion',
        initials: 'RK'
      },
      {
        quote: "The subjective grading is a game changer. I finally know where I lose marks in exam answers.",
        name: 'Ananya P.',
        badge: '15-Day Streak',
        initials: 'AP'
      },
      {
        quote: "I love challenging my friends to quiz battles. It makes studying so much more fun.",
        name: 'Mehul J.',
        badge: 'Top Learner',
        initials: 'MJ'
      },
    ],
    stats: {
        score: { val: '98%', desc: 'Students report better scores' },
        concepts: { val: '15M+', desc: 'Concepts Mastered' },
        battles: { val: '5M+', desc: 'Quiz Battles Won' },
        active: { val: '89%', desc: 'Daily Active Students' }
    }
  },
  hi: {
    title: 'छात्रों द्वारा पसंद किया गया',
    count: 'होशियारी से सीखने वाले 10,000+ छात्रों से जुड़ें',
    testimonials: [
      {
        quote: "ConceptScroll ने मेरे रिविज़न का तरीका बदल दिया। यह इंस्टाग्राम स्क्रॉल करने जैसा है लेकिन मैं वास्तव में कुछ सीखता हूँ!",
        name: 'राहुल के.',
        badge: 'विज्ञान चैंपियन',
        initials: 'RK'
      },
      {
        quote: "सब्जेक्टिव ग्रेडिंग एक गेम चेंजर है। मुझे आखिरकार पता चला कि परीक्षा के उत्तरों में मेरे नंबर कहां कटते हैं।",
        name: 'अनन्या पी.',
        badge: '15-दिन की स्ट्रीक',
        initials: 'AP'
      },
      {
        quote: "मुझे अपने दोस्तों को क्विज़ बैटल के लिए चुनौती देना पसंद है। यह पढ़ाई को इतना मजेदार बना देता है।",
        name: 'मेहुल जे.',
        badge: 'टॉप लर्नर',
        initials: 'MJ'
      },
    ],
    stats: {
        score: { val: '98%', desc: 'छात्रों ने बेहतर स्कोर की सूचना दी' },
        concepts: { val: '1.5 करोड़+', desc: 'अवधारणाएं सीखी गईं' },
        battles: { val: '50 लाख+', desc: 'क्विज़ बैटल जीती गईं' },
        active: { val: '89%', desc: 'दैनिक सक्रिय छात्र' }
    }
  }
};

interface TestimonialCardProps {
  quote: string;
  initials: string;
  name: string;
  badge: string;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, initials, name, badge, index }) => {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-md p-8 border border-gray-100 transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="mb-6 text-purple-200">
        <Quote size={40} />
      </div>
      <p className="text-gray-700 mb-8 text-lg italic leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          {initials}
        </div>
        <div>
          <div className="font-bold text-gray-900">{name}</div>
          <div className="text-sm text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-1">{badge}</div>
        </div>
      </div>
    </motion.div>
  );
};

export const SocialProofSection = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  
  // Stats animation
  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: { 
        delay: custom * 0.1,
        duration: 0.5,
        type: "spring", 
        stiffness: 100 
      }
    })
  };
  
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-xl text-gray-600">{t.count}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {t.testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              initials={testimonial.initials}
              name={testimonial.name}
              badge={testimonial.badge}
              index={index}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div 
            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-purple-100"
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={statsVariants}
          >
            <div className="text-4xl font-bold text-purple-600 mb-2">{t.stats.score.val}</div>
            <div className="text-gray-600 font-medium">{t.stats.score.desc}</div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-blue-100"
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={statsVariants}
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">{t.stats.concepts.val}</div>
            <div className="text-gray-600 font-medium">{t.stats.concepts.desc}</div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-orange-100"
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={statsVariants}
          >
            <div className="text-4xl font-bold text-orange-500 mb-2">{t.stats.battles.val}</div>
            <div className="text-gray-600 font-medium">{t.stats.battles.desc}</div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-green-100"
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={statsVariants}
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-2">{t.stats.active.val}</div>
            <div className="text-gray-600 font-medium">{t.stats.active.desc}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
