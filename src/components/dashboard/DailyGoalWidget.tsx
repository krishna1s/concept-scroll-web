import { useState } from 'react';
import { Target, CheckCircle2, Circle, Edit2 } from 'lucide-react';

type GoalType = 'quiz' | 'study_time' | 'notes';

interface DailyGoal {
  type: GoalType;
  target: number;
  current: number;
  label: string;
  unit: string;
}

export function DailyGoalWidget() {
  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState<DailyGoal>({
    type: 'quiz',
    target: 3,
    current: 1,
    label: 'Complete Quizzes',
    unit: 'quizzes'
  });

  const progress = Math.min((goal.current / goal.target) * 100, 100);

  const handleGoalUpdate = (newTarget: number) => {
    setGoal(prev => ({ ...prev, target: newTarget }));
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-red-100 p-2 rounded-lg">
            <Target className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Daily Goal</h3>
            <p className="text-xs text-gray-500">Keep up your streak!</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set your target ({goal.unit})
            </label>
            <div className="flex gap-2">
              {[1, 3, 5, 10].map((val) => (
                <button
                  key={val}
                  onClick={() => handleGoalUpdate(val)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    goal.target === val
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{goal.label}</span>
            <span className="text-sm font-bold text-gray-900">
              {goal.current} / {goal.target}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            {progress >= 100 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Goal completed! Great job! 🎉</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-gray-400" />
                <span>{goal.target - goal.current} more to go</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
