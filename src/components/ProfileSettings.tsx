import { useState, useEffect } from 'react';
import { UserProfile, Board, Class, Medium, OnboardingPreferences } from '../types';
import { ViewType } from '../App';
import { useAuth } from '../services/auth/AuthContext';
import { initiateRazorpayPayment } from '../services/payment/razorpay';
import { toast } from 'sonner@2.0.3';
import { ChevronLeft, User, Crown, Sparkles, Check, LogOut, Settings, Edit2, Save, X, Loader2 } from 'lucide-react';
import { apiClient } from '../services/api';
import { profileService } from '../services/profileService';

// Extended profile to include gamification and educational details
interface ExtendedUserProfile extends UserProfile {
  name?: string;
  level?: number;
  xp?: number;
  streak?: number;
  subscription?: string;
  board?: string;
  class?: string; // or grade
  medium?: string;
  school?: string;
  subjects?: string[]; // Names or IDs
}

type ProfileSettingsProps = {
  userProfile: ExtendedUserProfile;
  updateUserProfile: (updates: Partial<ExtendedUserProfile>) => void;
  onNavigate: (view: ViewType) => void;
};

const subscriptionTiers = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: [
      'Unlimited Notes Feed',
      'Chapter-wise Study Mode',
      '1 Daily Quiz',
      'Basic Progress Tracking',
      'Limited Features'
    ],
    limitations: [
      'No AI Grading',
      'No Peer Following',
      'Ads Included'
    ],
    color: 'from-gray-400 to-gray-500'
  },
  {
    name: 'Premium',
    price: '₹99',
    period: 'per month',
    popular: true,
    features: [
      'Everything in Free',
      '3 Daily Quizzes',
      'AI Answer Grading (5/day)',
      '7-Day Quiz History',
      'Streak Tracker',
      'Peer Following',
      '2 Study Circles',
      'Personalized Study Plan',
      'Voice Notes & TTS',
      'Parent Dashboard',
      'School Leaderboard',
      'No Ads'
    ],
    color: 'from-purple-500 to-blue-500'
  },
  {
    name: 'Pro',
    price: '₹199',
    period: 'per month',
    features: [
      'Everything in Premium',
      'Unlimited Daily Quizzes',
      'Unlimited AI Grading',
      'Unlimited Quiz History',
      'Unlimited Study Circles',
      'AI Doubt Solver',
      'AI Writing Assistance',
      'Priority Support',
      'Exclusive Badges'
    ],
    color: 'from-yellow-500 to-orange-500'
  }
];

export function ProfileSettings({ userProfile, updateUserProfile, onNavigate }: ProfileSettingsProps) {
  const { signOut, refreshProfile, preferences } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  // Metadata options
  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [mediums, setMediums] = useState<Medium[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: userProfile.first_name || '',
    lastName: userProfile.last_name || '',
    boardId: '',
    classId: '',
    mediumId: '',
    school: userProfile.school || ''
  });

  // Fetch fresh profile data on mount
  useEffect(() => {
    refreshProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize form data from profile
  useEffect(() => {
    // Helper to extract the best possible ID/Value
    // We prefer specific ID fields, then generic fields
    const getInitialValue = (...values: (string | undefined)[]) => {
        return values.find(v => v !== undefined && v !== null && v !== '') || '';
    };

    setFormData({
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        boardId: getInitialValue(userProfile.board_id, userProfile.board),
        classId: getInitialValue(userProfile.class_grade, userProfile.class_id, userProfile.class, userProfile.grade),
        mediumId: getInitialValue(userProfile.medium_id, userProfile.medium),
        school: userProfile.school || ''
    });
  }, [userProfile]);

  // Fetch metadata on mount to ensure we can map IDs to Names
  useEffect(() => {
    const fetchMetadata = async () => {
        setIsLoadingMetadata(true);
        try {
            const [boardsData, mediumsData] = await Promise.all([
                apiClient.getBoards(),
                apiClient.getMediums()
            ]);
            setBoards(boardsData);
            setMediums(mediumsData);
            
            // Check if current form data (from profile) needs to be mapped from Name -> ID
            // This handles the case where profile has "CBSE" instead of UUID
            let currentBoardId = formData.boardId || userProfile.board_id || userProfile.board;
            
            // Try to find matching board by ID or Name
            const matchedBoard = boardsData.find(b => b.id === currentBoardId || b.name.toLowerCase() === String(currentBoardId).toLowerCase());
            
            if (matchedBoard) {
                // If we found a match, ensure we use the ID
                currentBoardId = matchedBoard.id;
                // Update form data with the correct ID
                setFormData(prev => ({ ...prev, boardId: matchedBoard.id }));
            } else if (boardsData.length > 0 && !currentBoardId) {
                 // Fallback to first board if nothing selected/found
                 currentBoardId = boardsData[0].id;
            }

            if (currentBoardId) {
                const classesData = await apiClient.getClasses(currentBoardId);
                setClasses(classesData);
                
                // Smart Mapping for Class/Grade
                let currentClassId = formData.classId || userProfile.class_grade || userProfile.class_id || userProfile.class || userProfile.grade;
                const matchedClass = classesData.find(c => 
                    c.id === currentClassId || 
                    c.name.toLowerCase() === String(currentClassId).toLowerCase() || 
                    String(c.grade_number) === String(currentClassId)
                );
                
                if (matchedClass) {
                    if (matchedClass.id !== currentClassId) {
                        setFormData(prev => ({ ...prev, classId: matchedClass.id }));
                    }
                } else if (classesData.length > 0 && !currentClassId) {
                    // Fallback to first class
                    setFormData(prev => ({ ...prev, classId: classesData[0].id }));
                }
            }

            // Smart Mapping for Medium
            let currentMediumId = formData.mediumId || userProfile.medium_id || userProfile.medium;
            const matchedMedium = mediumsData.find(m => 
                m.id === currentMediumId || 
                m.name.toLowerCase() === String(currentMediumId).toLowerCase() || 
                m.code.toLowerCase() === String(currentMediumId).toLowerCase()
            );
            
            if (matchedMedium && matchedMedium.id !== currentMediumId) {
                 setFormData(prev => ({ ...prev, mediumId: matchedMedium.id }));
            } else if (mediumsData.length > 0 && !currentMediumId) {
                 setFormData(prev => ({ ...prev, mediumId: mediumsData[0].id }));
            }

        } catch (error) {
            console.error("Failed to fetch metadata", error);
        } finally {
            setIsLoadingMetadata(false);
        }
    };
    fetchMetadata();
  }, [userProfile]); // Added userProfile dependency to re-run mapping if profile loads late

  // Refetch classes if board changes in form
  useEffect(() => {
     if (formData.boardId) {
         const fetchClasses = async () => {
            try {
                const classesData = await apiClient.getClasses(formData.boardId);
                setClasses(classesData);
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
         };
         fetchClasses();
     }
  }, [formData.boardId]); 

  // Clean, reusable save handler
  const handleSaveProfile = async () => {
      setIsSaving(true);
      
      // Ensure we are sending IDs, not names
      // This protects against cases where the form data still holds the initial "name" value
      // because the user didn't change the selection and the auto-mapping failed or hasn't run.
      let finalBoardId = formData.boardId;
      if (boards.length > 0) {
          const matched = boards.find(b => b.id === finalBoardId || b.name === finalBoardId);
          if (matched) finalBoardId = matched.id;
      }

      let finalClassId = formData.classId;
      if (classes.length > 0) {
           const matched = classes.find(c => c.id === finalClassId || c.name === finalClassId || String(c.grade_number) === finalClassId);
           if (matched) finalClassId = matched.id;
      }

      let finalMediumId = formData.mediumId;
      if (mediums.length > 0) {
          const matched = mediums.find(m => m.id === finalMediumId || m.name === finalMediumId || m.code === finalMediumId);
          if (matched) finalMediumId = matched.id;
      }

      try {
          await profileService.updateProfile({
               first_name: formData.firstName,
               last_name: formData.lastName,
               board: finalBoardId,
               class_grade: finalClassId,
               medium: finalMediumId,
               school: formData.school,
           } as any);

          await refreshProfile();
          toast.success("Profile updated successfully");
          setIsEditing(false);
      } catch (error) {
          console.error("Failed to save profile", error);
          toast.error("Failed to save changes");
      } finally {
          setIsSaving(false);
      }
  };

  const getDisplayName = (type: 'board' | 'class' | 'medium', value: string | undefined) => {
      if (!value) return 'Not set';
      
      const strValue = String(value).toLowerCase();

      // Check if value matches an ID in our metadata
      if (type === 'board') {
          const item = boards.find(b => b.id === value || b.name.toLowerCase() === strValue);
          return item ? item.name : value;
      }
      if (type === 'class') {
          const item = classes.find(c => 
              c.id === value || 
              c.name.toLowerCase() === strValue || 
              String(c.grade_number) === strValue
          );
          return item ? item.name : value;
      }
      if (type === 'medium') {
          const item = mediums.find(m => 
              m.id === value || 
              m.name.toLowerCase() === strValue || 
              m.code.toLowerCase() === strValue
          );
          return item ? item.name : value;
      }
      return value;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // No need to reload, AuthContext state change will trigger re-render of App
    } catch (error) {
      console.error('Logout failed:', error);
      // Force reload as fallback
      window.location.reload();
    }
  };

  const handleSubscribe = (tierName: string) => {
    if (tierName === 'Free') return;
    
    const tier = subscriptionTiers.find(t => t.name === tierName);
    if (!tier) return;

    // Extract price number (e.g., "₹99" -> 99)
    const price = parseInt(tier.price.replace(/[^0-9]/g, ''), 10);

    const toastId = toast.loading('Initializing payment...');

    initiateRazorpayPayment({
      amount: price,
      name: `ConceptScroll ${tier.name}`,
      description: `${tier.name} Subscription for 1 Month`,
      user: {
        name: userProfile.name || userProfile.first_name || 'Student',
        email: userProfile.email || 'student@example.com',
        contact: userProfile.phone_number || '9999999999'
      },
      onSuccess: (paymentId) => {
        toast.dismiss(toastId);
        toast.success(`Payment Successful! Reference: ${paymentId}`);
        updateUserProfile({ subscription: tier.name.toLowerCase() });
      },
      onFailure: (error) => {
        toast.dismiss(toastId);
        toast.error('Payment Failed or Cancelled');
        console.error(error);
      }
    });
  };

  const currentTier = subscriptionTiers.find(
    t => t.name.toLowerCase() === (userProfile.subscription || 'free')
  );

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-4xl mx-auto">
      <button
        onClick={() => onNavigate('dashboard')}
        className="mb-6 p-2 hover:bg-white rounded-lg transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-3xl p-8 mb-6 text-center shadow-xl">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm ring-4 ring-white/10">
          <User className="w-12 h-12" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">{userProfile.name || userProfile.first_name || 'Student'}</h1>
        <div className="flex items-center justify-center gap-4 text-sm opacity-90 mb-4">
          <span>Level {userProfile.level || 1}</span>
          <span>•</span>
          <span>{userProfile.xp || 0} XP</span>
          <span>•</span>
          <span>{userProfile.streak || 0} Day Streak</span>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 ${
          userProfile.subscription === 'pro' 
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
            : userProfile.subscription === 'premium'
            ? 'bg-purple-700/50'
            : 'bg-white/20'
        }`}>
          {(userProfile.subscription === 'premium' || userProfile.subscription === 'pro') && (
            <Crown className="w-4 h-4" />
          )}
          <span className="capitalize font-medium">{userProfile.subscription || 'Free'}</span>
        </div>
      </div>

      {/* Profile Info / Edit Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Profile Information</h2>
            {!isEditing ? (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <Edit2 className="w-4 h-4" />
                    Edit
                </button>
            ) : (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSaving}
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                </div>
            )}
        </div>

        {isEditing ? (
            <div className="space-y-4 animate-in fade-in duration-200">
                {isLoadingMetadata ? (
                    <div className="py-8 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        Loading options...
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">First Name</label>
                                <input 
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                                <input 
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Board</label>
                            <select 
                                value={formData.boardId}
                                onChange={(e) => {
                                    const newBoardId = e.target.value;
                                    setFormData(prev => ({ ...prev, boardId: newBoardId, classId: '' }));
                                }}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            >
                                <option value="">Select Board</option>
                                {boards.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Class/Grade</label>
                            <select 
                                value={formData.classId}
                                onChange={(e) => setFormData({...formData, classId: e.target.value})}
                                disabled={!formData.boardId}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">Select Class</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Medium</label>
                            <select 
                                value={formData.mediumId}
                                onChange={(e) => setFormData({...formData, mediumId: e.target.value})}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            >
                                <option value="">Select Medium</option>
                                {mediums.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">School Name</label>
                            <input 
                                type="text"
                                value={formData.school}
                                onChange={(e) => setFormData({...formData, school: e.target.value})}
                                placeholder="Enter school name"
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </>
                )}
            </div>
        ) : (
            <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Board</span>
                    <span className="font-medium">{getDisplayName('board', userProfile.board || userProfile.board_id)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Class</span>
                    <span className="font-medium">{getDisplayName('class', userProfile.class_grade || userProfile.class_id || userProfile.class || userProfile.grade)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Medium</span>
                    <span className="font-medium">{getDisplayName('medium', userProfile.medium || userProfile.medium_id)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">School</span>
                    <span className="font-medium">{userProfile.school || 'Not specified'}</span>
                </div>
                <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subjects</span>
                    <span className="text-right font-medium">{userProfile.subjects?.length || 0} selected</span>
                </div>
            </div>
        )}
      </div>

      {/* Subscription Plans */}
      <div className="mb-6">
        <h2 className="mb-4 font-semibold text-lg">Subscription Plans</h2>
        <div className="space-y-4">
          {subscriptionTiers.map((tier) => {
            const isCurrentPlan = tier.name.toLowerCase() === (userProfile.subscription || 'free');
            return (
              <div
                key={tier.name}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${
                  isCurrentPlan ? 'border-purple-600' : 'border-transparent'
                } ${tier.popular ? 'relative' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3>{tier.name}</h3>
                      {isCurrentPlan && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl">{tier.price}</span>
                      <span className="text-gray-600 text-sm">/{tier.period}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center text-white`}>
                    {tier.name === 'Pro' ? (
                      <Sparkles className="w-6 h-6" />
                    ) : tier.name === 'Premium' ? (
                      <Crown className="w-6 h-6" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {!isCurrentPlan && (
                  <button
                    onClick={() => handleSubscribe(tier.name)}
                    className={`w-full py-3 rounded-xl transition-all ${
                      tier.name === 'Free'
                        ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r ' + tier.color + ' text-white hover:shadow-lg'
                    }`}
                    disabled={tier.name === 'Free'}
                  >
                    {tier.name === 'Free' ? 'Current Plan' : `Upgrade to ${tier.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Annual Offer */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎉</div>
          <div>
            <div className="mb-2">Save with Annual Plans</div>
            <p className="text-sm opacity-90 mb-4">
              Subscribe annually and get 2 months free! Premium at ₹990/year, Pro at ₹1990/year
            </p>
            <button className="bg-white text-green-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              View Annual Plans
            </button>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-purple-600" />
          <h2>Settings</h2>
        </div>
        <div className="space-y-3">
          <button className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
            Edit Profile
          </button>
          <button className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
            Notification Preferences
          </button>
          <button className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
            Privacy Settings
          </button>
          <button className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
            Language & Medium
          </button>
          <button className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
            Help & Support
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full py-4 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? Your progress is saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
