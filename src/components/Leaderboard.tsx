import { useState } from 'react';
import { UserProfile, ViewType } from '../App';
import { ChevronLeft, Trophy, Medal, Crown, TrendingUp, Users, UserPlus, Check } from 'lucide-react';

type LeaderboardProps = {
  userProfile: UserProfile;
  onNavigate: (view: ViewType) => void;
};

const globalLeaders = [
  { rank: 1, name: 'Priya Sharma', xp: 2450, level: 12, avatar: '👑', school: 'Delhi Public School', streak: 45, isFollowing: false },
  { rank: 2, name: 'Arjun Patel', xp: 2380, level: 11, avatar: '🏆', school: 'Ryan International', streak: 38, isFollowing: true },
  { rank: 3, name: 'Ananya Singh', xp: 2210, level: 11, avatar: '⭐', school: 'Modern School', streak: 42, isFollowing: false },
  { rank: 4, name: 'Rohan Kumar', xp: 2105, level: 10, avatar: '🎯', school: 'DAV Public School', streak: 35, isFollowing: false },
  { rank: 5, name: 'Meera Gupta', xp: 1980, level: 10, avatar: '💫', school: 'Kendriya Vidyalaya', streak: 30, isFollowing: true },
  { rank: 6, name: 'Kartik Verma', xp: 1875, level: 9, avatar: '🚀', school: 'Delhi Public School', streak: 28, isFollowing: false },
  { rank: 7, name: 'Ishita Reddy', xp: 1790, level: 9, avatar: '✨', school: 'Vidya Niketan', streak: 25, isFollowing: false },
  { rank: 8, name: 'Aditya Joshi', xp: 1650, level: 8, avatar: '🎓', school: 'Ryan International', streak: 22, isFollowing: false }
];

const subjectLeaders = [
  { rank: 1, name: 'Mathematics Expert', xp: 850, accuracy: 95 },
  { rank: 2, name: 'Science Wizard', xp: 820, accuracy: 92 },
  { rank: 3, name: 'History Master', xp: 780, accuracy: 90 },
  { rank: 4, name: 'English Pro', xp: 740, accuracy: 88 },
  { rank: 5, name: 'Physics Genius', xp: 710, accuracy: 87 }
];

export function Leaderboard({ userProfile, onNavigate }: LeaderboardProps) {
  const [following, setFollowing] = useState<Set<string>>(new Set(
    globalLeaders.filter(u => u.isFollowing).map(u => u.name)
  ));

  const toggleFollow = (userName: string) => {
    const newFollowing = new Set(following);
    if (newFollowing.has(userName)) {
      newFollowing.delete(userName);
    } else {
      newFollowing.add(userName);
    }
    setFollowing(newFollowing);
  };

  const schoolLeaders = [
    { rank: 1, name: 'Rahul Mehta', xp: 1850, level: 9, class: '10th', streak: 32 },
    { rank: 2, name: 'Sneha Das', xp: 1720, level: 9, class: '10th', streak: 28 },
    { rank: 3, name: userProfile.name, xp: userProfile.xp, level: userProfile.level, class: userProfile.class + 'th', streak: userProfile.streak },
    { rank: 4, name: 'Vikram Rao', xp: 1420, level: 7, class: '9th', streak: 20 },
    { rank: 5, name: 'Pooja Nair', xp: 1290, level: 7, class: '10th', streak: 18 }
  ];

  const [activeTab, setActiveTab] = useState<'global' | 'school' | 'subject'>('global');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-gray-600">#{rank}</span>;
  };

  const getRankBgColor = (rank: number, isCurrentUser: boolean = false) => {
    if (isCurrentUser) return 'from-purple-100 to-blue-100 border-2 border-purple-600';
    if (rank === 1) return 'from-yellow-50 to-yellow-100';
    if (rank === 2) return 'from-gray-50 to-gray-100';
    if (rank === 3) return 'from-orange-50 to-orange-100';
    return 'from-white to-white';
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
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1>Leaderboard</h1>
          <p className="text-gray-600">See how you rank against others</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-3 px-4 rounded-xl transition-all ${
            activeTab === 'global'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <TrendingUp className="w-4 h-4 mx-auto mb-1" />
          <span className="text-sm">Global</span>
        </button>
        <button
          onClick={() => setActiveTab('school')}
          className={`flex-1 py-3 px-4 rounded-xl transition-all ${
            activeTab === 'school'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4 mx-auto mb-1" />
          <span className="text-sm">School</span>
        </button>
        <button
          onClick={() => setActiveTab('subject')}
          className={`flex-1 py-3 px-4 rounded-xl transition-all ${
            activeTab === 'subject'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Trophy className="w-4 h-4 mx-auto mb-1" />
          <span className="text-sm">Subject</span>
        </button>
      </div>

      {/* Global Leaderboard */}
      {activeTab === 'global' && (
        <div>
          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-4 mb-8 px-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="text-4xl mb-2">{globalLeaders[1].avatar}</div>
              <div className="text-sm text-center mb-2">{globalLeaders[1].name}</div>
              <div className="w-full bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-xl p-4 text-center">
                <Medal className="w-8 h-8 mx-auto mb-2 text-white" />
                <div className="text-white">{globalLeaders[1].xp} XP</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="text-5xl mb-2">{globalLeaders[0].avatar}</div>
              <div className="text-sm text-center mb-2">{globalLeaders[0].name}</div>
              <div className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-xl p-4 text-center">
                <Crown className="w-10 h-10 mx-auto mb-2 text-white" />
                <div className="text-white">{globalLeaders[0].xp} XP</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="text-4xl mb-2">{globalLeaders[2].avatar}</div>
              <div className="text-sm text-center mb-2">{globalLeaders[2].name}</div>
              <div className="w-full bg-gradient-to-t from-orange-600 to-orange-500 rounded-t-xl p-4 text-center">
                <Medal className="w-8 h-8 mx-auto mb-2 text-white" />
                <div className="text-white">{globalLeaders[2].xp} XP</div>
              </div>
            </div>
          </div>

          {/* Rest of the list */}
          <div className="space-y-3">
            {globalLeaders.slice(3).map((user) => {
              const isFollowed = following.has(user.name);
              return (
                <div
                  key={user.rank}
                  className={`bg-gradient-to-r ${getRankBgColor(user.rank)} rounded-xl p-4 shadow-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex items-center justify-center flex-shrink-0">
                      {getRankIcon(user.rank)}
                    </div>
                    <div className="text-3xl">{user.avatar}</div>
                    <div className="flex-1">
                      <div className="mb-1 font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">
                        {user.school} • Level {user.level}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-purple-600 font-bold mb-1">{user.xp} XP</div>
                        <div className="text-xs text-gray-600 flex items-center justify-end gap-1">
                          <Trophy className="w-3 h-3" />
                          {user.streak} days
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollow(user.name);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          isFollowed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        }`}
                      >
                        {isFollowed ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* School Leaderboard */}
      {activeTab === 'school' && (
        <div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-700">
              <Users className="w-5 h-5" />
              <span>Competing with {userProfile.school || 'your school'}</span>
            </div>
          </div>

          <div className="space-y-3">
            {schoolLeaders.map((user) => {
              const isCurrentUser = user.name === userProfile.name;
              return (
                <div
                  key={user.rank}
                  className={`bg-gradient-to-r ${getRankBgColor(user.rank, isCurrentUser)} rounded-xl p-4 shadow-sm ${
                    isCurrentUser ? 'shadow-lg' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex items-center justify-center flex-shrink-0">
                      {getRankIcon(user.rank)}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        {user.name}
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs">You</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Class {user.class} • Level {user.level}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-600 mb-1">{user.xp} XP</div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {user.streak} days
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject Leaderboard */}
      {activeTab === 'subject' && (
        <div>
          <div className="mb-6">
            <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none">
              <option>Mathematics</option>
              <option>Science</option>
              <option>History</option>
              <option>English</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
            </select>
          </div>

          <div className="space-y-3">
            {subjectLeaders.map((user) => (
              <div
                key={user.rank}
                className={`bg-gradient-to-r ${getRankBgColor(user.rank)} rounded-xl p-4 shadow-sm`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">{user.name}</div>
                    <div className="text-sm text-gray-600">
                      Accuracy: {user.accuracy}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-600">{user.xp} XP</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Premium Feature Lock */}
      {userProfile.subscription === 'free' && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6 mt-8">
          <div className="flex items-start gap-4">
            <Trophy className="w-6 h-6 flex-shrink-0" />
            <div>
              <div className="mb-2">Unlock Full Leaderboard Access</div>
              <p className="text-sm opacity-90 mb-4">
                Upgrade to Premium to see detailed rankings, compete in subject-specific leaderboards, and access school-wide competitions!
              </p>
              <button
                onClick={() => onNavigate('profile')}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
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
