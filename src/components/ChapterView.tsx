import { useState } from 'react';
import { UserProfile, ViewType } from '../App';
import { ChevronLeft, BookOpen, Brain, CheckCircle, Lock, Play } from 'lucide-react';

type ChapterViewProps = {
  chapter: any;
  userProfile: UserProfile;
  onNavigate: (view: ViewType) => void;
  onBack: () => void;
};

const mockNotes = [
  { id: 1, title: 'Introduction to the topic', duration: '5 min', completed: true, locked: false },
  { id: 2, title: 'Key concepts and definitions', duration: '8 min', completed: true, locked: false },
  { id: 3, title: 'Problem-solving techniques', duration: '12 min', completed: false, locked: false },
  { id: 4, title: 'Common mistakes to avoid', duration: '6 min', completed: false, locked: false },
  { id: 5, title: 'Advanced applications', duration: '10 min', completed: false, locked: true }
];

const mockQuestions = [
  {
    id: 1,
    type: 'MCQ',
    question: 'What is the discriminant formula?',
    options: ['b² - 4ac', 'b² + 4ac', '-b ± √(b² - 4ac)', 'ax² + bx + c'],
    correct: 0
  },
  {
    id: 2,
    type: 'MCQ',
    question: 'If discriminant = 0, what does it mean?',
    options: ['Two distinct roots', 'One repeated root', 'Complex roots', 'No roots'],
    correct: 1
  }
];

export function ChapterView({ chapter, userProfile, onNavigate, onBack }: ChapterViewProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'practice' | 'quiz'>('notes');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex });
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const correctAnswers = mockQuestions.filter(q => selectedAnswers[q.id] === q.correct).length;

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-6">
        <button
          onClick={onBack}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-sm opacity-90 mb-2">{chapter.subject}</div>
          <h1 className="mb-4">{chapter.name}</h1>
          
          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${chapter.progress}%` }}
            />
          </div>
          <div className="text-sm mt-2 opacity-90">{chapter.progress}% Complete</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 'notes'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
          >
            <BookOpen className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 'practice'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
          >
            <Brain className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Practice</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 'quiz'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
          >
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Quiz</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2>Chapter Notes</h2>
              <span className="text-sm text-gray-600">
                {mockNotes.filter(n => n.completed).length}/{mockNotes.length} completed
              </span>
            </div>
            {mockNotes.map((note) => (
              <div
                key={note.id}
                className={`bg-white rounded-xl p-4 shadow-sm ${
                  note.locked ? 'opacity-50' : 'hover:shadow-md cursor-pointer'
                } transition-shadow`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    note.completed
                      ? 'bg-green-100'
                      : note.locked
                      ? 'bg-gray-100'
                      : 'bg-purple-100'
                  }`}>
                    {note.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : note.locked ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : (
                      <Play className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">{note.title}</div>
                    <div className="text-sm text-gray-600">{note.duration}</div>
                  </div>
                  {note.locked && (
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Premium
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'practice' && (
          <div>
            <h2 className="mb-4">Practice Questions</h2>
            <div className="space-y-4">
              {mockQuestions.map((question, qIndex) => (
                <div key={question.id} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="mb-4">
                    <span className="text-purple-600 text-sm">Question {qIndex + 1}</span>
                    <div className="mt-2">{question.question}</div>
                  </div>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswerSelect(question.id, oIndex)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                          selectedAnswers[question.id] === oIndex
                            ? showResults
                              ? oIndex === question.correct
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                              : 'border-purple-500 bg-purple-50'
                            : showResults && oIndex === question.correct
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showResults && oIndex === question.correct && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {!showResults ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length !== mockQuestions.length}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answers
                </button>
              ) : (
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">{correctAnswers}/{mockQuestions.length}</div>
                  <div className="mb-4">Questions Correct</div>
                  <div className="text-lg mb-4">
                    You earned +{correctAnswers * 10} XP!
                  </div>
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setSelectedAnswers({});
                    }}
                    className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 max-w-md mx-auto">
              <Brain className="w-16 h-16 mx-auto mb-4" />
              <h2 className="mb-4">Chapter Challenge</h2>
              <p className="mb-6 opacity-90">
                Complete a timed quiz to test your mastery of this chapter
              </p>
              <button
                onClick={() => onNavigate('quiz')}
                className="bg-white text-purple-600 px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Start Quiz
              </button>
              <div className="mt-6 text-sm opacity-75">
                10 questions • 10 minutes • 50 XP reward
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
