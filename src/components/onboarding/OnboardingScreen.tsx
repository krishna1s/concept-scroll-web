import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { apiClient } from '../../services/api';
import { Board, Class, Medium, Subject } from '../../types';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export function OnboardingScreen() {
  const { refreshProfile, updatePreferences } = useAuth();
  const { strings } = useLocalization();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Data from API
  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [mediums, setMediums] = useState<Medium[]>([]);
  
  // Selected values
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedMedium, setSelectedMedium] = useState<string>('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      setSelectedClass('');
      loadClasses();
    }
  }, [selectedBoard]);

  const loadInitialData = async () => {
    try {
      setIsLoadingData(true);
      const [boardsData, mediumsData] = await Promise.all([
        apiClient.getBoards(),
        apiClient.getMediums(),
      ]);
      setBoards(boardsData);
      setMediums(mediumsData);
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadClasses = async () => {
    try {
      const classesData = await apiClient.getClasses(selectedBoard);
      setClasses(classesData);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);

      const selectedBoardData = boards.find(b => b.id === selectedBoard);
      const selectedClassData = classes.find(c => c.id === selectedClass);
      const selectedMediumData = mediums.find(m => m.id === selectedMedium);
      
      const savedPrefs = await apiClient.saveOnboardingPreferences({
        role: selectedRole,
        board_id: selectedBoard,
        class_id: selectedClass,
        medium_id: selectedMedium,
        subject_ids: [],
        data: {
          board: selectedBoardData?.name,
          grade: selectedClassData?.grade_number?.toString(),
          medium: selectedMediumData?.name
        }
      });
      
      // Update context immediately with the returned preferences
      if (savedPrefs) {
        updatePreferences(savedPrefs);
      } else {
        // Fallback to refresh if save didn't return preferences
        await refreshProfile();
      }
    } catch (error) {
      console.error('Failed to save onboarding preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedRole !== '';
      case 2:
        return selectedBoard !== '';
      case 3:
        return selectedClass !== '';
      case 4:
        return selectedMedium !== '';
      default:
        return false;
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-2">{strings.onboarding.title}</h1>
          <p className="text-gray-600 mb-4">{strings.onboarding.subtitle}</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {strings.onboarding.step} {step} {strings.onboarding.of} 4
          </p>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {/* Step 1: Role */}
          {step === 1 && (
            <div>
              <h2 className="text-gray-900 mb-6">{strings.onboarding.selectRole}</h2>
              <div className="grid grid-cols-3 gap-4">
                {(['student', 'teacher', 'parent'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedRole === role
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-3">
                      {role === 'student' && '🎓'}
                      {role === 'teacher' && '👨‍🏫'}
                      {role === 'parent' && '👨‍👩‍👧'}
                    </div>
                    <div className="text-gray-900">
                      {strings.onboarding[role]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Board */}
          {step === 2 && (
            <div>
              <h2 className="text-gray-900 mb-6">{strings.onboarding.selectBoard}</h2>
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {boards.map(board => (
                  <button
                    key={board.id}
                    onClick={() => setSelectedBoard(board.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      selectedBoard === board.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-gray-900 mb-1">{board.name}</div>
                    {board.description && (
                      <p className="text-sm text-gray-600">{board.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Class */}
          {step === 3 && (
            <div>
              <h2 className="text-gray-900 mb-6">{strings.onboarding.selectClass}</h2>
              <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {classes.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedClass === cls.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-gray-900">{cls.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Medium */}
          {step === 4 && (
            <div>
              <h2 className="text-gray-900 mb-6">{strings.onboarding.selectMedium}</h2>
              <div className="grid grid-cols-3 gap-4">
                {mediums.map(medium => (
                  <button
                    key={medium.id}
                    onClick={() => setSelectedMedium(medium.id)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedMedium === medium.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-gray-900">{medium.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            {strings.onboarding.back}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                {step === 4 ? strings.onboarding.finish : strings.onboarding.next}
                {step < 4 && <ChevronRight className="w-5 h-5" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}