import React, { useState } from 'react';
import { ContentItem, Note, Quiz, Poll } from '../../types';
import { RotateCw, Check, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface FlashcardDeckProps {
  items: ContentItem[];
  onNext: () => void;
}

export function FlashcardDeck({ items, onNext }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  // Filter only notes and quizzes for flashcards
  const cards = items.filter(item => item.type === 'note' || item.type === 'quiz');
  
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-500 mb-4">No revision cards available right now.</p>
        <button onClick={onNext} className="text-purple-600 font-medium">Load More Content</button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setDirection('right');
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onNext(); // Load more or reset
        setCurrentIndex(0);
      }
      setDirection(null);
    }, 300);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setDirection('left');
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setDirection(null);
      }, 300);
    }
  };

  const getFrontContent = (item: ContentItem) => {
    if (item.type === 'note') {
      const note = item.content as Note;
      return (
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            {item.subject?.name || 'Topic'}
          </span>
          <h3 className="text-2xl font-bold text-gray-900 leading-snug">
            {note.title}
          </h3>
          <p className="mt-6 text-gray-400 text-sm font-medium animate-pulse">
            Tap to flip
          </p>
        </div>
      );
    } else if (item.type === 'quiz') {
      const quiz = item.content as Quiz;
      return (
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            Quiz Challenge
          </span>
          <h3 className="text-xl font-bold text-gray-900 leading-snug">
             {quiz.questions[0]?.question || quiz.title}
          </h3>
          <div className="mt-8 flex flex-col gap-2 opacity-50 blur-[2px]">
             <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
             <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-400 text-sm font-medium animate-pulse">
            Tap to reveal answer
          </p>
        </div>
      );
    }
  };

  const getBackContent = (item: ContentItem) => {
    if (item.type === 'note') {
      const note = item.content as Note;
      return (
        <div className="text-center w-full">
          <div className="text-left text-gray-800 text-lg leading-relaxed font-medium">
            {note.summary || note.content.substring(0, 150) + '...'}
          </div>
          {note.media_urls?.[0] && (
            <img 
              src={note.media_urls[0]} 
              className="mt-4 rounded-lg h-32 w-full object-cover opacity-80" 
              alt="Visual aid"
            />
          )}
        </div>
      );
    } else if (item.type === 'quiz') {
       const quiz = item.content as Quiz;
       const q = quiz.questions[0];
       if (!q) return <div>No questions</div>;
       
       return (
         <div className="w-full text-left space-y-3">
            {q.options.map((opt, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  idx === q.correct_answer 
                    ? 'bg-green-50 border-green-200 text-green-900 font-bold' 
                    : 'bg-gray-50 border-gray-100 text-gray-400'
                }`}
              >
                <span>{opt}</span>
                {idx === q.correct_answer && <Check className="w-5 h-5 text-green-600" />}
              </div>
            ))}
            <div className="pt-2 text-xs text-center text-gray-400">
               Explanation: {q.explanation || 'Review the chapter for details.'}
            </div>
         </div>
       );
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500 font-medium">
        <span>Card {currentIndex + 1} of {cards.length}</span>
        <span className="text-purple-600">Flashcards</span>
      </div>

      {/* Card Container */}
      <div className="relative flex-1 perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div 
          className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div 
             className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl border border-gray-200 p-8 flex flex-col items-center justify-center"
             style={{ backfaceVisibility: 'hidden' }}
          >
             {getFrontContent(currentCard)}
          </div>

          {/* Back */}
          <div 
             className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl border border-purple-200 p-8 flex flex-col items-center justify-center rotate-y-180 bg-gradient-to-br from-purple-50 to-white"
             style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
             {getBackContent(currentCard)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          disabled={currentIndex === 0}
          className="p-4 rounded-full bg-white shadow-md text-gray-400 disabled:opacity-50 hover:text-gray-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
          className="p-4 rounded-full bg-purple-100 text-purple-600 shadow-md hover:bg-purple-200 transition-colors"
        >
          <RotateCw className="w-6 h-6" />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="p-4 rounded-full bg-white shadow-md text-green-500 hover:text-green-600 hover:scale-105 transition-all"
        >
          <Check className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
