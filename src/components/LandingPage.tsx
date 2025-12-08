import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronDown, ChevronRight, Globe, Star, Zap, BookOpen, Brain, Users, Trophy } from 'lucide-react';
import { ScrollFeedSection } from './landing/ScrollFeedSection';
import { SocialProofSection } from './landing/SocialProofSection';
import { CommunitySection } from './landing/CommunitySection';
import { CtaSection } from './landing/CtaSection';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

type Language = 'en' | 'hi';

const translations = {
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      login: 'Login',
      getStarted: 'Get Started'
    },
    hero: {
      title: 'Study smarter, not harder.',
      subtitle: "India's First Educational Social Media Platform. Scroll through concepts, challenge friends, and master your syllabus.",
      cta: 'Start Learning for Free',
      users: 'Join 10,000+ Students'
    },
    features: {
      title: 'Why ConceptScroll?',
      subtitle: 'Replace passive scrolling with active learning.',
      items: [
        {
          title: 'Concept Feed',
          desc: 'Short, engaging micro-notes that feel like Reels but help you learn.',
          icon: BookOpen
        },
        {
          title: 'AI Tutor',
          desc: 'Get instant grading and feedback on your subjective answers.',
          icon: Brain
        },
        {
          title: 'Social Learning',
          desc: 'Follow toppers, challenge friends, and climb the leaderboard.',
          icon: Users
        },
        {
          title: 'Gamified Progress',
          desc: 'Earn XP, maintain streaks, and win badges for consistency.',
          icon: Trophy
        }
      ]
    },
    pricing: {
      title: 'Plans for every student',
      monthly: '/month',
      free: {
        name: 'Free',
        price: '₹0',
        desc: 'Perfect for getting started'
      },
      premium: {
        name: 'Premium',
        price: '₹99',
        desc: 'For serious learners'
      },
      pro: {
        name: 'Pro',
        price: '₹199',
        desc: 'The ultimate study companion'
      }
    }
  },
  hi: {
    nav: {
      features: 'विशेषताएँ',
      pricing: 'मूल्य',
      login: 'लॉग इन',
      getStarted: 'शुरू करें'
    },
    hero: {
      title: 'होशियारी से पढ़ें, मेहनत से नहीं।',
      subtitle: "भारत का पहला शैक्षिक सोशल मीडिया प्लेटफ़ॉर्म। कॉन्सेप्ट्स को स्क्रॉल करें, दोस्तों को चुनौती दें और अपना सिलेबस पूरा करें।",
      cta: 'मुफ्त में सीखना शुरू करें',
      users: '10,000+ छात्रों से जुड़ें'
    },
    features: {
      title: 'ConceptScroll ही क्यों?',
      subtitle: 'निष्क्रिय स्क्रॉलिंग को सक्रिय सीखने के साथ बदलें।',
      items: [
        {
          title: 'कॉन्सेप्ट फीड',
          desc: 'छोटी, दिलचस्प माइक्रो-नोट्स जो रील्स जैसी लगती हैं लेकिन आपको सीखने में मदद करती हैं।',
          icon: BookOpen
        },
        {
          title: 'AI ट्यूटर',
          desc: 'अपने विस्तृत उत्तरों पर तुरंत ग्रेडिंग और फीडबैक प्राप्त करें।',
          icon: Brain
        },
        {
          title: 'सोशल लर्निंग',
          desc: 'टॉपर्स को फॉलो करें, दोस्तों को चुनौती दें और लीडरबोर्ड पर चढ़ें।',
          icon: Users
        },
        {
          title: 'गेमिफाइड प्रगति',
          desc: 'XP कमाएं, स्ट्रीक बनाए रखें और निरंतरता के लिए बैज जीतें।',
          icon: Trophy
        }
      ]
    },
    pricing: {
      title: 'हर छात्र के लिए योजनाएं',
      monthly: '/माह',
      free: {
        name: 'फ्री',
        price: '₹0',
        desc: 'शुरुआत करने के लिए बिल्कुल सही'
      },
      premium: {
        name: 'प्रीमियम',
        price: '₹99',
        desc: 'गंभीर शिक्षार्थियों के लिए'
      },
      pro: {
        name: 'प्रो',
        price: '₹199',
        desc: 'सर्वश्रेष्ठ अध्ययन साथी'
      }
    }
  }
};

export function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  const toggleLang = () => setLang(l => l === 'en' ? 'hi' : 'en');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                ConceptScroll
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">{t.nav.features}</a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">{t.nav.pricing}</a>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleLang}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-purple-600 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-4 h-4" />
                {lang === 'en' ? 'HI' : 'EN'}
              </button>
              <button 
                onClick={onLogin}
                className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                {t.nav.login}
              </button>
              <button 
                onClick={onSignup}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30"
              >
                {t.nav.getStarted}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-purple-600"></span>
                India's First Ed-Social Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                {t.hero.title.split(',')[0]}, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  {t.hero.title.split(',')[1]?.trim() || "ConceptScroll"}
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onSignup}
                  className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all shadow-xl hover:shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                  {t.hero.cta}
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                   Download App
                </button>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                      {String.fromCharCode(64+i)}
                    </div>
                  ))}
                </div>
                {t.hero.users}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200/50 to-blue-200/50 rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1686624386665-4cd01b96d0f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHVkZW50JTIwc3R1ZHlpbmclMjB3aXRoJTIwbW9iaWxlJTIwcGhvbmUlMjBoYXBweSUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjUyMTQ2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Student learning"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Daily Streak</div>
                      <div className="text-sm font-bold text-gray-900">12 Days 🔥</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg max-w-[200px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-xs font-bold text-gray-900">AI Feedback</div>
                  </div>
                  <div className="text-xs text-gray-600">
                    "Great explanation of Newton's Law! Try adding an example."
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">{t.features.title}</h2>
            <p className="text-gray-600 text-lg">{t.features.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.items.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Interactive Sections */}
      <ScrollFeedSection lang={lang} />
      <SocialProofSection lang={lang} />
      <CommunitySection lang={lang} />
      
      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">{t.pricing.title}</h2>
            <p className="text-gray-600">Choose the plan that fits your learning style.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-3xl p-8 hover:border-purple-200 transition-colors">
              <div className="mb-4">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t.pricing.free.name}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">{t.pricing.free.price}</span>
                <span className="text-gray-500">{t.pricing.monthly}</span>
              </div>
              <p className="text-gray-600 mb-8">{t.pricing.free.desc}</p>
              <button onClick={onSignup} className="w-full py-3 px-4 rounded-xl border-2 border-gray-100 font-semibold hover:border-purple-600 hover:text-purple-600 transition-all">
                Get Started
              </button>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Unlimited Notes Feed
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  1 Daily Quiz
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Basic Tracking
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="relative border-2 border-purple-600 rounded-3xl p-8 bg-purple-50/50">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                Most Popular
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">{t.pricing.premium.name}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">{t.pricing.premium.price}</span>
                <span className="text-gray-500">{t.pricing.monthly}</span>
              </div>
              <p className="text-gray-600 mb-8">{t.pricing.premium.desc}</p>
              <button onClick={onSignup} className="w-full py-3 px-4 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30">
                Subscribe Now
              </button>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="p-1 bg-purple-100 rounded-full"><Check className="w-3 h-3 text-purple-600" /></div>
                  Everything in Free
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="p-1 bg-purple-100 rounded-full"><Check className="w-3 h-3 text-purple-600" /></div>
                  3 Daily Quizzes
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="p-1 bg-purple-100 rounded-full"><Check className="w-3 h-3 text-purple-600" /></div>
                  AI Grading (5/day)
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="p-1 bg-purple-100 rounded-full"><Check className="w-3 h-3 text-purple-600" /></div>
                  Parent Dashboard
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="border border-gray-200 rounded-3xl p-8 hover:border-purple-200 transition-colors">
              <div className="mb-4">
                <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">{t.pricing.pro.name}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">{t.pricing.pro.price}</span>
                <span className="text-gray-500">{t.pricing.monthly}</span>
              </div>
              <p className="text-gray-600 mb-8">{t.pricing.pro.desc}</p>
              <button onClick={onSignup} className="w-full py-3 px-4 rounded-xl border-2 border-gray-100 font-semibold hover:border-orange-500 hover:text-orange-500 transition-all">
                Go Pro
              </button>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Unlimited Everything
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  AI Doubt Solver
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Writing Assistance
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Priority Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection lang={lang} onSignup={onSignup} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-white">
                  C
                </div>
                <span className="text-xl font-bold">ConceptScroll</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Making education addictive, interactive, and effective for every student in India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            © 2024 ConceptScroll Education Pvt Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}