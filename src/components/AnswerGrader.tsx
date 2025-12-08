import { useState } from 'react';
import { UserProfile, ViewType } from '../App';
import { ChevronLeft, Sparkles, CheckCircle, AlertCircle, Lightbulb, Mic } from 'lucide-react';

type AnswerGraderProps = {
  userProfile: UserProfile;
  onNavigate: (view: ViewType) => void;
};

const sampleQuestions = [
  {
    id: 1,
    subject: 'History',
    question: 'Explain the main causes of the French Revolution.',
    maxMarks: 5
  },
  {
    id: 2,
    subject: 'Science',
    question: 'What is photosynthesis? Explain the process.',
    maxMarks: 5
  },
  {
    id: 3,
    subject: 'English',
    question: 'Write a paragraph about your favorite season.',
    maxMarks: 3
  }
];

export function AnswerGrader({ userProfile, onNavigate }: AnswerGraderProps) {
  const [selectedQuestion, setSelectedQuestion] = useState(sampleQuestions[0]);
  const [answer, setAnswer] = useState('');
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleGrade = () => {
    if (userProfile.subscription === 'free') {
      alert('AI Grading is available for Premium and Pro subscribers. Upgrade to unlock this feature!');
      return;
    }

    setGrading(true);
    
    // Simulate AI grading
    setTimeout(() => {
      const mockResult = {
        score: Math.floor(Math.random() * 2) + Math.ceil(selectedQuestion.maxMarks * 0.6),
        maxScore: selectedQuestion.maxMarks,
        feedback: {
          strengths: [
            'Good understanding of key concepts',
            'Clear and logical structure',
            'Relevant examples provided'
          ],
          improvements: [
            'Could include more specific details',
            'Add transitional phrases for better flow',
            'Consider expanding on the conclusion'
          ],
          grammar: {
            score: 8,
            issues: ['Minor punctuation improvements needed']
          },
          completeness: {
            score: 7,
            missing: ['Historical dates could be more specific']
          }
        },
        suggestions: [
          'Try starting with a strong topic sentence',
          'Use more descriptive vocabulary',
          'Include cause and effect relationships'
        ],
        improvedVersion: 'The French Revolution was caused by several interconnected factors. Firstly, social inequality was rampant, with the Third Estate bearing the burden of taxation while the clergy and nobility enjoyed privileges. Secondly, France faced a severe financial crisis due to involvement in costly wars and extravagant royal spending. Additionally, Enlightenment ideas promoting liberty, equality, and fraternity inspired people to question the existing monarchical system. Finally, poor harvests and rising bread prices created widespread discontent among the masses, ultimately leading to the revolution of 1789.'
      };
      
      setResult(mockResult);
      setGrading(false);
    }, 2000);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would use Web Speech API
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setAnswer(answer + ' [Voice input simulation] ');
      }, 3000);
    }
  };

  const canUseFeature = () => {
    return userProfile.subscription !== 'free';
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-4xl mx-auto">
      <button
        onClick={() => onNavigate('dashboard')}
        className="mb-6 p-2 hover:bg-white rounded-lg transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1>AI Answer Grader</h1>
          <p className="text-gray-600">Get instant feedback on your answers</p>
        </div>
      </div>

      {/* Question Selector */}
      <div className="mb-6">
        <label className="block mb-3">Select a Question</label>
        <div className="space-y-2">
          {sampleQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setSelectedQuestion(q);
                setAnswer('');
                setResult(null);
              }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                selectedQuestion.id === q.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-purple-600 mb-1">{q.subject}</div>
                  <div className="text-sm">{q.question}</div>
                </div>
                <div className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  {q.maxMarks} marks
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Answer Input */}
      {!result && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label>Your Answer</label>
            {!canUseFeature() && (
              <div className="flex items-center gap-1 text-yellow-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Premium Feature</span>
              </div>
            )}
          </div>
          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or speak your answer here..."
              className="w-full h-64 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none resize-none"
            />
            <button
              onClick={handleVoiceInput}
              className={`absolute bottom-4 right-4 p-3 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>{answer.length} characters</span>
            {isRecording && <span className="text-red-600">Recording...</span>}
          </div>

          <button
            onClick={handleGrade}
            disabled={answer.length < 10 || grading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {grading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>AI is analyzing your answer...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Grade My Answer</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-6 text-center">
            <div className="text-5xl mb-2">{result.score}/{result.maxScore}</div>
            <div className="text-lg">Your Score</div>
          </div>

          {/* Feedback Sections */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3>Strengths</h3>
            </div>
            <ul className="space-y-2">
              {result.feedback.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3>Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {result.feedback.improvements.map((improvement: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-yellow-600 mt-1">→</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Grammar & Completeness */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-3">Grammar</div>
              <div className="text-3xl mb-2">{result.feedback.grammar.score}/10</div>
              <p className="text-sm text-gray-600">{result.feedback.grammar.issues[0]}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-3">Completeness</div>
              <div className="text-3xl mb-2">{result.feedback.completeness.score}/10</div>
              <p className="text-sm text-gray-600">{result.feedback.completeness.missing[0]}</p>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3>AI Suggestions</h3>
            </div>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-600 mt-1">💡</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improved Version */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="mb-4">Enhanced Version</h3>
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
              <p className="text-gray-700">{result.improvedVersion}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setAnswer('');
                setResult(null);
              }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Try Another Question
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Premium Prompt */}
      {userProfile.subscription === 'free' && !result && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-6 mt-6">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 flex-shrink-0" />
            <div>
              <div className="mb-2">Upgrade to Use AI Grader</div>
              <p className="text-sm opacity-90 mb-4">
                Get instant feedback, grammar checks, and personalized suggestions for all your answers!
              </p>
              <button
                onClick={() => onNavigate('profile')}
                className="bg-white text-orange-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
