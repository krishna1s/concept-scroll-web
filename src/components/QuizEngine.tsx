import { useState, useEffect } from 'react';
import { UserProfile, ViewType } from '../App';
import { ChevronLeft, Clock, Zap, Trophy, ChevronRight } from 'lucide-react';

type QuizEngineProps = {
  userProfile: UserProfile;
  onNavigate: (view: ViewType) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
};

const quizQuestions = [
  {
    id: 1,
    subject: 'Mathematics',
    question: 'What is the value of √144?',
    options: ['10', '11', '12', '13'],
    correct: 2,
    difficulty: 'Easy'
  },
  {
    id: 2,
    subject: 'Science',
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct: 2,
    difficulty: 'Easy'
  },
  {
    id: 3,
    subject: 'History',
    question: 'When did India gain independence?',
    options: ['1945', '1946', '1947', '1948'],
    correct: 2,
    difficulty: 'Medium'
  },
  {
    id: 4,
    subject: 'Geography',
    question: 'Which is the longest river in India?',
    options: ['Yamuna', 'Ganges', 'Brahmaputra', 'Godavari'],
    correct: 1,
    difficulty: 'Medium'
  },
  {
    id: 5,
    subject: 'Physics',
    question: 'What is the SI unit of force?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correct: 1,
    difficulty: 'Easy'
  },
  {
    id: 6,
    subject: 'Chemistry',
    question: 'What is the atomic number of Carbon?',
    options: ['4', '6', '8', '12'],
    correct: 1,
    difficulty: 'Medium'
  },
  {
    id: 7,
    subject: 'Biology',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'],
    correct: 2,
    difficulty: 'Easy'
  },
  {
    id: 8,
    subject: 'Mathematics',
    question: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correct: 1,
    difficulty: 'Medium'
  },
  {
    id: 9,
    subject: 'English',
    question: 'What is the plural of "child"?',
    options: ['Childs', 'Children', 'Childrens', 'Childes'],
    correct: 1,
    difficulty: 'Easy'
  },
  {
    id: 10,
    subject: 'Civics',
    question: 'How many fundamental rights are there in Indian Constitution?',
    options: ['5', '6', '7', '8'],
    correct: 1,
    difficulty: 'Hard'
  }
];

export function QuizEngine({ userProfile, onNavigate, updateUserProfile }: QuizEngineProps) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Filter questions based on selected subject
  const availableQuestions = selectedSubject === 'All' 
    ? quizQuestions 
    : quizQuestions.filter(q => q.subject === selectedSubject);

  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleFinishQuiz();
    }
  }, [quizStarted, quizCompleted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      setAnswers({ ...answers, [availableQuestions[currentQuestion].id]: selectedAnswer });
      setSelectedAnswer(null);
      
      if (currentQuestion < availableQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleFinishQuiz();
      }
    }
  };

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
    const finalAnswers = selectedAnswer !== null 
      ? { ...answers, [availableQuestions[currentQuestion].id]: selectedAnswer }
      : answers;
    
    const correctCount = availableQuestions.filter(q => finalAnswers[q.id] === q.correct).length;
    const earnedXP = correctCount * 5;
    
    updateUserProfile({
      xp: userProfile.xp + earnedXP,
      streak: userProfile.streak + 1
    });
  };

  const correctAnswers = availableQuestions.filter(q => answers[q.id] === q.correct).length;
  const totalXP = correctAnswers * 5;

  if (!quizStarted) {
    return (
      <div className="min-h-screen pb-20 px-4 pt-6 max-w-4xl mx-auto">
        <button
          onClick={() => onNavigate('dashboard')}
          className="mb-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-3xl p-8 text-center">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          
          <h1 className="mb-4">Daily Quiz Challenge</h1>
          <p className="text-lg mb-8 opacity-90">
            Test your knowledge across all subjects
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-1">{availableQuestions.length}</div>
              <div className="text-sm opacity-90">Questions</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-1">10:00</div>
              <div className="text-sm opacity-90">Time Limit</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-1">{availableQuestions.length * 5}</div>
              <div className="text-sm opacity-90">Max XP</div>
            </div>
          </div>

          <div className="space-y-3 mb-8 text-left bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="mb-3">Quiz Rules:</h3>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
              <p>Answer all {availableQuestions.length} questions within the time limit</p>
            </div>
            {/* ... rules ... */}
          </div>

          {/* Subject Selector */}
          <div className="mb-6">
             <label className="block text-white/80 text-sm font-medium mb-2">Select Subject / Book</label>
             <select 
               value={selectedSubject}
               onChange={(e) => setSelectedSubject(e.target.value)}
               className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
             >
               <option value="All" className="text-gray-900">All Subjects (General)</option>
               {Array.from(new Set(quizQuestions.map(q => q.subject))).map(subject => (
                 <option key={subject} value={subject} className="text-gray-900">{subject}</option>
               ))}
             </select>
          </div>

          <button
            onClick={() => {
              if (availableQuestions.length === 0) {
                 alert('No questions available for this subject.');
                 return;
              }
              setQuizStarted(true);
            }}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl hover:shadow-lg transition-all w-full max-w-sm mx-auto"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = availableQuestions.length > 0 ? (correctAnswers / availableQuestions.length) * 100 : 0;
    const grade = percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : percentage >= 40 ? 'Keep Practicing!' : 'Need Improvement';

    return (
      <div className="min-h-screen pb-20 px-4 pt-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 text-center shadow-lg">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : percentage >= 40 ? '💪' : '📚'}
          </div>
          
          <h1 className="mb-2">{grade}</h1>
          <p className="text-gray-600 mb-8">You've completed the daily quiz</p>

          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-8">
            <div className="text-5xl mb-2">{correctAnswers}/{availableQuestions.length}</div>
            <div className="text-lg mb-4">Correct Answers</div>
            <div className="text-3xl mb-2">+{totalXP} XP</div>
            <div className="opacity-90">Points Earned</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-1">{percentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-1">{formatTime(600 - timeLeft)}</div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setQuizStarted(false);
                setQuizCompleted(false);
                setCurrentQuestion(0);
                setAnswers({});
                setTimeLeft(600);
              }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = availableQuestions[currentQuestion];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className={timeLeft < 60 ? 'text-red-600' : ''}>{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>+{totalXP} XP</span>
            </div>
          </div>
          <div className="flex gap-1">
            {availableQuestions.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index < currentQuestion
                    ? 'bg-green-600'
                    : index === currentQuestion
                    ? 'bg-purple-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="px-4 pt-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm mb-4">
            <span>{question.subject}</span>
            <span>•</span>
            <span>{question.difficulty}</span>
          </div>
          <div className="text-gray-600 mb-2">Question {currentQuestion + 1} of {availableQuestions.length}</div>
          <h2 className="mb-6">{question.question}</h2>
        </div>

        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedAnswer === index
                    ? 'border-purple-600 bg-purple-600 text-white'
                    : 'border-gray-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {currentQuestion < availableQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
