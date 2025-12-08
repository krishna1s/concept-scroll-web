import { UserProfile, ViewType } from '../App';
import { ChevronLeft, TrendingUp, Award, BookOpen, Target, Calendar, Flame } from 'lucide-react';

type ProgressTrackerProps = {
  userProfile: UserProfile;
  onNavigate: (view: ViewType) => void;
};

const subjectProgress = [
  { subject: 'Mathematics', completed: 12, total: 20, accuracy: 85, color: 'from-blue-500 to-blue-600' },
  { subject: 'Science', completed: 8, total: 18, accuracy: 78, color: 'from-green-500 to-green-600' },
  { subject: 'History', completed: 15, total: 16, accuracy: 92, color: 'from-yellow-500 to-yellow-600' },
  { subject: 'English', completed: 10, total: 15, accuracy: 88, color: 'from-purple-500 to-purple-600' }
];

const weeklyActivity = [
  { day: 'Mon', xp: 45, quizzes: 2 },
  { day: 'Tue', xp: 60, quizzes: 3 },
  { day: 'Wed', xp: 30, quizzes: 1 },
  { day: 'Thu', xp: 75, quizzes: 4 },
  { day: 'Fri', xp: 50, quizzes: 2 },
  { day: 'Sat', xp: 40, quizzes: 2 },
  { day: 'Sun', xp: 55, quizzes: 3 }
];

const recentAchievements = [
  { icon: '🔥', title: '7-Day Streak', date: 'Today', xp: 50 },
  { icon: '⭐', title: 'Quiz Master', date: 'Yesterday', xp: 25 },
  { icon: '📚', title: 'Chapter Complete', date: '2 days ago', xp: 30 },
  { icon: '🎯', title: 'Perfect Score', date: '3 days ago', xp: 40 }
];

const upcomingMilestones = [
  { title: 'Complete 20 Chapters', current: 12, target: 20, reward: '100 XP' },
  { title: 'Maintain 30-Day Streak', current: 7, target: 30, reward: 'Pro Badge' },
  { title: 'Score 90% in 5 Quizzes', current: 2, target: 5, reward: '50 XP' }
];

export function ProgressTracker({ userProfile, onNavigate }: ProgressTrackerProps) {
  const maxXp = Math.max(...weeklyActivity.map(d => d.xp));

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-4xl mx-auto">
      <button
        onClick={() => onNavigate('dashboard')}
        className="mb-6 p-2 hover:bg-white rounded-lg transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <h1 className="mb-6">Your Progress</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-sm">Current Streak</span>
          </div>
          <div className="text-3xl mb-1">{userProfile.streak}</div>
          <p className="text-sm opacity-90">Days in a row</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm">Total XP</span>
          </div>
          <div className="text-3xl mb-1">{userProfile.xp}</div>
          <p className="text-sm opacity-90">Points earned</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm">Chapters</span>
          </div>
          <div className="text-3xl mb-1">12/20</div>
          <p className="text-sm opacity-90">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm">Level</span>
          </div>
          <div className="text-3xl mb-1">{userProfile.level}</div>
          <p className="text-sm opacity-90">Current level</p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h2>This Week's Activity</h2>
        </div>
        <div className="flex items-end justify-between gap-2 h-40 mb-4">
          {weeklyActivity.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-gray-600">{day.xp}</div>
              <div className="w-full bg-purple-200 rounded-t-lg relative" style={{ height: `${(day.xp / maxXp) * 100}%`, minHeight: '20%' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg" />
              </div>
              <div className="text-xs">{day.day}</div>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600 text-center">
          Total this week: {weeklyActivity.reduce((sum, d) => sum + d.xp, 0)} XP from {weeklyActivity.reduce((sum, d) => sum + d.quizzes, 0)} quizzes
        </div>
      </div>

      {/* Subject Progress */}
      <div className="mb-6">
        <h2 className="mb-4">Subject-wise Progress</h2>
        <div className="space-y-4">
          {subjectProgress.map((subject, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="mb-1">{subject.subject}</div>
                  <div className="text-sm text-gray-600">{subject.completed}/{subject.total} chapters</div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 mb-1">{subject.accuracy}%</div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${subject.color} transition-all duration-300`}
                  style={{ width: `${(subject.completed / subject.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2>Recent Achievements</h2>
          <button className="text-purple-600 text-sm hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recentAchievements.map((achievement, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-sm mb-1">{achievement.title}</div>
              <div className="text-xs text-gray-600 mb-2">{achievement.date}</div>
              <div className="text-xs text-purple-600">+{achievement.xp} XP</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div className="mb-6">
        <h2 className="mb-4">Upcoming Milestones</h2>
        <div className="space-y-4">
          {upcomingMilestones.map((milestone, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="mb-1">{milestone.title}</div>
                  <div className="text-sm text-gray-600">{milestone.current}/{milestone.target}</div>
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                  {milestone.reward}
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Insights */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h3>Study Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm">💪</div>
            <p className="text-sm opacity-90">You're doing great! Your consistency has improved by 40% this week.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm">📊</div>
            <p className="text-sm opacity-90">History is your strongest subject with 92% accuracy.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm">🎯</div>
            <p className="text-sm opacity-90">Focus on Science chapters to maintain your streak.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
