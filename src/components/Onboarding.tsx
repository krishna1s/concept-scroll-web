import { useState } from 'react';
import { GraduationCap, BookOpen, Globe, CheckCircle } from 'lucide-react';
import { UserProfile } from '../App';

type OnboardingProps = {
  onComplete: (profile: UserProfile) => void;
};

const boards = ['CBSE', 'ICSE', 'State Board'];
const classes = ['6', '7', '8', '9', '10', '11', '12'];
const mediums = ['English', 'Hindi'];
const subjects = [
  'Mathematics',
  'Science',
  'Social Science',
  'English',
  'Hindi',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Civics',
  'Economics'
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]); // Keep state but don't use it
  const [school, setSchool] = useState('');

  const handleSubjectToggle = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      name,
      board: selectedBoard,
      class: selectedClass,
      medium: selectedMedium,
      subjects: [], // Don't send subjects anymore
      school: school || undefined,
      streak: 0,
      xp: 0,
      level: 1,
      subscription: 'free'
    };
    onComplete(profile);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return name.length > 0;
      case 1: return selectedBoard.length > 0;
      case 2: return selectedClass.length > 0;
      case 3: return selectedMedium.length > 0;
      case 4: return true; // School is optional
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 md:p-12">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="ml-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            ConceptScroll
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Step {step + 1} of 5</span>
            <span className="text-gray-600">{Math.round(((step + 1) / 5) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
              style={{ width: `${((step + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="mb-2">Welcome! What's your name?</h2>
                <p className="text-gray-600">Let's personalize your learning journey</p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:outline-none transition-colors"
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="mb-2">Select Your Board</h2>
                <p className="text-gray-600">Choose your education board</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {boards.map((board) => (
                  <button
                    key={board}
                    onClick={() => setSelectedBoard(board)}
                    className={`p-6 border-2 rounded-2xl transition-all ${
                      selectedBoard === board
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{board}</span>
                      {selectedBoard === board && (
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="mb-2">Select Your Class</h2>
                <p className="text-gray-600">Which grade are you studying in?</p>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                {classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`p-3 sm:p-4 border-2 rounded-xl transition-all text-sm sm:text-base ${
                      selectedClass === cls
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center leading-tight">
                      <div className="text-xs sm:text-sm text-gray-600">Class</div>
                      <div className="font-semibold">{cls}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="mb-2">Select Your Medium</h2>
                <p className="text-gray-600">Choose your preferred language</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {mediums.map((medium) => (
                  <button
                    key={medium}
                    onClick={() => setSelectedMedium(medium)}
                    className={`p-6 border-2 rounded-2xl transition-all ${
                      selectedMedium === medium
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-3 text-purple-600" />
                        <span>{medium}</span>
                      </div>
                      {selectedMedium === medium && (
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="mb-2">Add Your School (Optional)</h2>
                <p className="text-gray-600">Connect with your classmates</p>
              </div>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Enter your school name"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:outline-none transition-colors"
              />
              <div className="text-center text-sm text-gray-500">
                You can skip this step and add it later
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < 4) {
                setStep(step + 1);
              } else {
                handleComplete();
              }
            }}
            disabled={!canProceed()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step < 4 ? 'Continue' : 'Start Learning'}
          </button>
        </div>
      </div>
    </div>
  );
}