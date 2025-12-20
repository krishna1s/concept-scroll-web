import { useState, useEffect, useRef } from 'react';
import { Target, Flame, ChevronRight, CheckCircle2, Play, Pause, Square, Clock, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/api';
import { DailyGoal } from '../../types';
import { SetGoalModal } from './SetGoalModal';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from '../ui/button';

interface DailyGoalWidgetProps {
  userProfile: any; 
  onNavigate?: (path: string) => void;
}

export function DailyGoalWidget({ userProfile, onNavigate }: DailyGoalWidgetProps) {
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  
  // Timer State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchGoal = async () => {
    try {
      setIsLoading(true);
      let currentGoal = await apiClient.getCurrentDailyGoal();
      
      // If no goal for today, check for upcoming goal (tomorrow)
      if (!currentGoal) {
         try {
             const now = new Date();
             const tomorrow = new Date(now);
             tomorrow.setDate(tomorrow.getDate() + 1);
             const tomorrowStr = tomorrow.toISOString().split('T')[0];
             
             const goals = await apiClient.getUserGoals(tomorrowStr);
             if (goals && goals.length > 0) {
                 // Map UserGoal to DailyGoal structure if needed
                 const userGoal = goals[0] as any;
                 currentGoal = {
                     ...userGoal,
                     target_minutes: userGoal.target_minutes || userGoal.target_value || 0,
                     completed_minutes: userGoal.completed_minutes || userGoal.current_value || 0,
                     current: userGoal.current_value || 0,
                     target: userGoal.target_value || 0,
                     subject_name: userGoal.subject_name || userGoal.title || 'Upcoming Goal',
                     is_active: false,
                     is_completed: userGoal.completed
                 } as DailyGoal;
             }
         } catch (e) {
             console.log("No upcoming goal found");
         }
      }

      setGoal(currentGoal);
      
      if (currentGoal) {
          // Initialize timer if active
          if (currentGoal.is_active && currentGoal.session_start_time) {
              const start = new Date(currentGoal.session_start_time).getTime();
              const now = new Date().getTime();
              const initialElapsed = Math.floor((now - start) / 1000) + ((currentGoal.elapsed_session_minutes || 0) * 60);
              // Ensure we don't start with negative time if server time diff matches oddly, but usually session_start_time is trustworthy
              setElapsedSeconds(initialElapsed > 0 ? initialElapsed : 0);
          } else {
             // Not active, display progress based on completed_minutes
             setElapsedSeconds((currentGoal.completed_minutes || 0) * 60);
          }
      }

      // Check for celebration (just completed)
      if (currentGoal?.is_completed && !showCelebration) {
          setShowCelebration(true);
      }
    } catch (error) {
      console.error("Failed to fetch daily goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
    return () => stopTimer();
  }, []);

  // Timer Effect
  useEffect(() => {
    // Safety check: if goal is completed, stop timer immediately
    if (goal?.is_completed || (goal && goal.target_minutes > 0 && (goal.completed_minutes || 0) >= goal.target_minutes)) {
        stopTimer();
        return;
    }

    if (goal?.is_active) {
        startTimer();
    } else {
        stopTimer();
    }
    return () => stopTimer();
  }, [goal?.is_active, goal?.is_completed, goal?.completed_minutes]);

  const startTimer = () => {
      if (timerRef.current) return;
      timerRef.current = setInterval(() => {
          setElapsedSeconds(prev => prev + 1);
      }, 1000);
  };

  const stopTimer = () => {
      if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
      }
  };

  const handleStartSession = async () => {
      if (!goal || !goal.id) return;
      
      setIsSessionLoading(true);
      try {
          // Check if session is already active (should be caught by state, but double check)
          if (goal.is_active) {
              if (onNavigate) onNavigate('study-session');
              return;
          }

          const updatedGoal = await apiClient.startDailyGoalSession(goal.id);
          setGoal(updatedGoal);
          toast.success("Study session started! ⏱️");
          
          if (onNavigate) {
             onNavigate('study-session'); 
          }
      } catch (error: any) {
          console.error("Failed to start session:", error);
          
          // Fix for "Goal already completed" error where backend state is ahead of frontend
          if (error.message && (
             error.message.includes("Goal already completed") || 
             error.message.includes("already completed")
          )) {
             toast.info("Goal was already completed! Updating status... 🎉");
             setGoal(prev => prev ? { ...prev, is_completed: true, completed_minutes: prev.target_minutes || prev.target || 30 } : null);
             return;
          }
          
          toast.error("Could not start session");
      } finally {
          setIsSessionLoading(false);
      }
  };

  const handleEnterSession = () => {
     if (onNavigate) onNavigate('study-session');
  };

  const handleStopSession = async () => {
      if (!goal || !goal.id) return;

      setIsSessionLoading(true);
      try {
          // Calculate minutes studied in this session roughly for optimistic UI, 
          // but backend will do accurate calc based on start time.
          // However, spec says we send "minutes_studied" in body? 
          // Actually, spec says: POST /api/onboarding/user/goals/{goal_id}/stop-session/ with body { minutes_studied: 25 }
          // We need to calculate how many minutes were studied IN THIS SESSION.
          // Ideally backend handles this using start_time, but if API requires it:
          
          // Let's rely on backend calculation if possible, but if we MUST send it:
          // The elapsedSeconds includes previous sessions if we just summed them up?
          // No, usually we'd track session_start local time.
          // But to be safe and simple, let's send 0 and hope backend uses server time, OR send total elapsed?
          // Looking at API spec again: "Frontend calculates elapsed time, calls stop-session API"
          
          // OK, we need to know accurate session duration.
          // If we reloaded page, we lost local start time variable, but we have goal.session_start_time.
          // Calculate seconds studied in this session
          let sessionSeconds = 0;
          if (goal.session_start_time) {
              const start = new Date(goal.session_start_time).getTime();
              const now = new Date().getTime();
              sessionSeconds = Math.max(0, Math.floor((now - start) / 1000));
          }
          
          const updatedGoal = await apiClient.stopDailyGoalSession(goal.id, sessionSeconds);
          setGoal(updatedGoal);
          toast.success(`Session stopped. Progress saved!`);
          
          // Update local elapsed to match returned goal
          setElapsedSeconds((updatedGoal.completed_minutes || 0) * 60);

      } catch (error) {
          console.error("Failed to stop session:", error);
          toast.error("Could not stop session");
      } finally {
          setIsSessionLoading(false);
      }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  // State 1: No Goal Set
  if (!goal) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-bold text-gray-900">No Daily Goal Set 📝</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Set a goal to start your learning journey and build a streak!
            </p>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
            >
                Set Daily Goal
            </button>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-50 rounded-full opacity-50 blur-xl" />
        
        <SetGoalModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onGoalSet={(newGoal) => setGoal(newGoal)}
            userClassId={userProfile?.class_id || userProfile?.class || '10'}
        />
      </div>
    );
  }

  // State 4: Goal Completed
  if (goal.is_completed || (goal.target_minutes > 0 && goal.completed_minutes >= goal.target_minutes)) {
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-100 mb-6 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900">Goal Completed! 🎉</h3>
                            <div className="flex items-center gap-1 text-xs text-green-700 font-medium">
                                <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                                {goal.streak || 1} Day Streak
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-yellow-600 border border-yellow-100 shadow-sm">
                        +50 XP
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-green-800 font-medium mb-1">
                        {goal.subject_name}
                    </p>
                    <div className="h-3 bg-white/50 rounded-full overflow-hidden border border-green-100">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-full" />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-green-700">
                        <span>{goal.target_minutes || goal.target} / {goal.target_minutes || goal.target} min</span>
                        <span>100%</span>
                    </div>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-2.5 bg-white text-green-700 border border-green-200 rounded-xl font-medium text-sm hover:bg-green-50 transition-colors"
                >
                    Set Tomorrow's Goal
                </button>
            </div>
            
             <SetGoalModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onGoalSet={(newGoal) => setGoal(newGoal)}
                userClassId={userProfile?.class_id || userProfile?.class || '10'} 
                isTomorrow={true}
            />
        </div>
      );
  }

  // State 2 & 3: Goal In Progress (Active or Paused)
  const targetMin = goal.target_minutes || goal.target || 30;
  const currentMin = Math.floor(elapsedSeconds / 60);
  const percentage = Math.min(100, Math.round((currentMin / targetMin) * 100));
  const isActive = goal.is_active;

  // Check if goal is for future date
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isFutureGoal = goal.date && goal.date > todayStr;

  return (
    <div className={`rounded-2xl p-6 shadow-sm border mb-6 relative group transition-colors ${
        isActive ? 'bg-purple-50 border-purple-100' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-start justify-between mb-4">
          <div>
              <div className="flex items-center gap-2 mb-1">
                  {isActive ? (
                       <span className="animate-pulse flex items-center gap-1.5 text-purple-700 font-bold text-sm">
                           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                           Studying...
                       </span>
                  ) : (
                      <h3 className="font-bold text-gray-900">
                        {isFutureGoal ? 'Upcoming Goal 📅' : "Today's Goal 🎯"}
                      </h3>
                  )}
                  
                  {goal.streak ? (
                      <span className="flex items-center gap-0.5 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 ml-2">
                          <Flame className="w-3 h-3 fill-orange-500" /> {goal.streak}
                      </span>
                  ) : null}
              </div>
              <p className="text-sm text-gray-700 font-medium">
                  {goal.subject_name}
              </p>
          </div>
          
          {/* Action Menu (Change Goal) */}
          {!isActive && (
            <button 
                onClick={() => setIsModalOpen(true)}
                className="text-gray-400 hover:text-purple-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg"
            >
                <Target className="w-4 h-4" />
            </button>
          )}
      </div>

      <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
             <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className={`font-mono text-lg font-bold ${isActive ? 'text-purple-700' : 'text-gray-700'}`}>
                    {formatTime(elapsedSeconds)}
                </span>
             </div>
             <span className="text-xs font-bold text-gray-500">
                 Target: {targetMin}m
             </span>
          </div>
          
          <div className="h-3 bg-white rounded-full overflow-hidden border border-gray-100">
              <div 
                  className={`h-full transition-all duration-1000 ease-linear ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                        : 'bg-gray-300'
                  }`}
                  style={{ width: `${percentage}%` }}
              />
          </div>
          <div className="flex justify-end mt-1">
              <span className="text-xs font-bold text-purple-600">{percentage}%</span>
          </div>
      </div>

      {isActive ? (
          <div className="space-y-3">
              <Button 
                onClick={handleEnterSession}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200"
              >
                  <Play className="w-4 h-4 mr-2 fill-current" /> Enter Study Mode
              </Button>
              <Button 
                onClick={handleStopSession}
                disabled={isSessionLoading}
                variant="outline"
                className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              >
                  {isSessionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Square className="w-4 h-4 mr-2 fill-current" />}
                  Stop Session
              </Button>
          </div>
      ) : (
          isFutureGoal ? (
             <Button 
                disabled 
                variant="outline"
                className="w-full border-gray-200 text-gray-400 bg-gray-50"
             >
                <Clock className="w-4 h-4 mr-2" />
                Starts {(() => {
                    const [y, m, d] = goal.date!.split('-').map(Number);
                    return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'long' });
                })()}
             </Button>
          ) : (
            <Button 
                onClick={handleStartSession}
                disabled={isSessionLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200"
            >
                {isSessionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
                {goal.current > 0 ? 'Continue Studying' : 'Start Studying'}
            </Button>
          )
      )}

      <SetGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onGoalSet={(newGoal) => setGoal(newGoal)}
        userClassId={userProfile?.class_id || userProfile?.class || '10'} 
      />
    </div>
  );
}
