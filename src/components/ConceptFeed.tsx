import { useState, useRef, useEffect } from 'react';
import { UserProfile, ViewType } from '../App';
import { Heart, Bookmark, Share2, MessageCircle, ChevronUp } from 'lucide-react';

type ConceptFeedProps = {
  userProfile: UserProfile;
  onNavigate: (view: ViewType) => void;
};

const mockConcepts = [
  {
    id: 1,
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    title: 'Understanding the Discriminant',
    content: 'The discriminant (b² - 4ac) tells us about the nature of roots:\n\n• If b² - 4ac > 0: Two distinct real roots\n• If b² - 4ac = 0: One repeated real root\n• If b² - 4ac < 0: Two complex roots',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=600&fit=crop',
    hashtags: ['#Mathematics', '#Quadratic', '#Algebra'],
    likes: 234,
    bookmarks: 89,
    comments: 12,
    xpValue: 5
  },
  {
    id: 2,
    subject: 'Science',
    chapter: 'Chemical Reactions',
    title: 'Types of Chemical Reactions',
    content: '1. Combination Reaction: A + B → AB\n2. Decomposition: AB → A + B\n3. Displacement: A + BC → AC + B\n4. Double Displacement: AB + CD → AD + CB\n\nRemember: Energy is either absorbed or released in all reactions!',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop',
    hashtags: ['#Chemistry', '#Reactions', '#Science'],
    likes: 456,
    bookmarks: 156,
    comments: 28,
    xpValue: 5
  },
  {
    id: 3,
    subject: 'History',
    chapter: 'French Revolution',
    title: 'Causes of French Revolution',
    content: 'Key factors that led to the revolution:\n\n• Social Inequality (Three Estates)\n• Financial Crisis (War debts)\n• Enlightenment Ideas (Liberty, Equality)\n• Weak Leadership (Louis XVI)\n• Food Scarcity & Rising Prices\n\nThe people demanded change!',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=600&fit=crop',
    hashtags: ['#History', '#FrenchRevolution', '#Europe'],
    likes: 189,
    bookmarks: 67,
    comments: 15,
    xpValue: 5
  },
  {
    id: 4,
    subject: 'Biology',
    chapter: 'Cell Structure',
    title: 'Mitochondria - The Powerhouse',
    content: 'Mitochondria are the energy producers of the cell!\n\n• Double membrane structure\n• Contains its own DNA\n• Site of cellular respiration\n• Produces ATP (energy currency)\n• More abundant in energy-demanding cells\n\nFormula: C₆H₁₂O₆ + O₂ → CO₂ + H₂O + ATP',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=600&fit=crop',
    hashtags: ['#Biology', '#CellBiology', '#Mitochondria'],
    likes: 567,
    bookmarks: 234,
    comments: 42,
    xpValue: 5
  },
  {
    id: 5,
    subject: 'Physics',
    chapter: 'Newton\'s Laws',
    title: 'Newton\'s Third Law',
    content: 'For every action, there is an equal and opposite reaction.\n\nExamples:\n• Walking: Foot pushes ground backward, ground pushes you forward\n• Swimming: Hands push water back, water pushes you forward\n• Rocket: Gases expelled downward, rocket moves upward\n\nForces always occur in pairs!',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=600&fit=crop',
    hashtags: ['#Physics', '#Newton', '#Motion'],
    likes: 392,
    bookmarks: 178,
    comments: 31,
    xpValue: 5
  }
];

export function ConceptFeed({ userProfile, onNavigate }: ConceptFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedConcepts, setLikedConcepts] = useState<number[]>([]);
  const [bookmarkedConcepts, setBookmarkedConcepts] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const currentConcept = mockConcepts[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaY = touchStartY.current - touchEndY.current;
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0 && currentIndex < mockConcepts.length - 1) {
        // Scroll down
        setCurrentIndex(currentIndex + 1);
      } else if (deltaY < 0 && currentIndex > 0) {
        // Scroll up
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 30 && currentIndex < mockConcepts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaY < -30 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleLike = (id: number) => {
    if (likedConcepts.includes(id)) {
      setLikedConcepts(likedConcepts.filter(i => i !== id));
    } else {
      setLikedConcepts([...likedConcepts, id]);
    }
  };

  const toggleBookmark = (id: number) => {
    if (bookmarkedConcepts.includes(id)) {
      setBookmarkedConcepts(bookmarkedConcepts.filter(i => i !== id));
    } else {
      setBookmarkedConcepts([...bookmarkedConcepts, id]);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full bg-black overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Back Button */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="absolute top-6 left-4 z-30 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronUp className="w-5 h-5 rotate-[-90deg]" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute top-6 right-4 z-30 flex gap-1">
        {mockConcepts.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-white' 
                : index < currentIndex
                ? 'w-4 bg-white/50'
                : 'w-4 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Concept Card */}
      <div 
        key={currentConcept.id}
        className="h-full w-full flex flex-col relative animate-fadeIn"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentConcept.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-24">
          {/* Subject Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-full text-white text-sm mb-3 self-start">
            <span>{currentConcept.subject}</span>
            <span className="opacity-70">•</span>
            <span className="opacity-90">{currentConcept.chapter}</span>
          </div>

          {/* Title */}
          <h2 className="text-white mb-3">{currentConcept.title}</h2>

          {/* Content */}
          <div className="text-white/90 mb-4 whitespace-pre-line max-h-64 overflow-y-auto">
            {currentConcept.content}
          </div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {currentConcept.hashtags.map((tag, index) => (
              <span key={index} className="text-purple-300 text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span>{currentConcept.likes} likes</span>
            <span>{currentConcept.comments} comments</span>
            <span>{currentConcept.bookmarks} saved</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute right-4 bottom-32 z-20 flex flex-col gap-6">
          <button
            onClick={() => toggleLike(currentConcept.id)}
            className="flex flex-col items-center gap-1"
          >
            <div className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
              likedConcepts.includes(currentConcept.id)
                ? 'bg-red-600'
                : 'bg-black/50 hover:bg-black/70'
            }`}>
              <Heart 
                className={`w-6 h-6 ${
                  likedConcepts.includes(currentConcept.id) ? 'fill-white' : ''
                } text-white`}
              />
            </div>
            <span className="text-white text-xs">
              {currentConcept.likes + (likedConcepts.includes(currentConcept.id) ? 1 : 0)}
            </span>
          </button>

          <button
            onClick={() => toggleBookmark(currentConcept.id)}
            className="flex flex-col items-center gap-1"
          >
            <div className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
              bookmarkedConcepts.includes(currentConcept.id)
                ? 'bg-yellow-600'
                : 'bg-black/50 hover:bg-black/70'
            }`}>
              <Bookmark 
                className={`w-6 h-6 ${
                  bookmarkedConcepts.includes(currentConcept.id) ? 'fill-white' : ''
                } text-white`}
              />
            </div>
            <span className="text-white text-xs">
              {currentConcept.bookmarks + (bookmarkedConcepts.includes(currentConcept.id) ? 1 : 0)}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs">{currentConcept.comments}</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs">Share</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-white/50 text-sm animate-bounce">
          Scroll to continue
        </div>
      </div>
    </div>
  );
}
