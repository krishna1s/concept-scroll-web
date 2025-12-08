import React, { useState } from 'react';
import { ContentItem, Note, Quiz, Poll } from '../../types';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { Heart, MessageCircle, Bookmark, Share2, Clock, CheckCircle, BarChart2, Eye, MoreHorizontal, FileText } from 'lucide-react';

interface FeedCardProps {
  item: ContentItem;
  onLike: (itemId: string, isLiked: boolean) => void;
  onBookmark: (itemId: string, isBookmarked: boolean) => void;
  onShare: (itemId: string) => void;
  onContentClick?: (item: ContentItem) => void;
  isDetailView?: boolean;
}

export function FeedCard({ item, onLike, onBookmark, onShare, onContentClick, isDetailView = false }: FeedCardProps) {
  const { strings } = useLocalization();
  const [showFullContent, setShowFullContent] = useState(isDetailView);

  const renderContent = () => {
    switch (item.type) {
      case 'note':
        return <NoteContent note={item.content as Note} showFull={showFullContent || isDetailView} />;
      case 'quiz':
        return <QuizContent quiz={item.content as Quiz} />;
      case 'poll':
        return <PollContent poll={item.content as Poll} itemId={item.id} userResponse={item.user_poll_response} />;
      default:
        return null;
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking a button or link
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (!isDetailView && onContentClick) {
      onContentClick(item);
    }
  };

  return (
    <div className={`bg-white ${isDetailView ? '' : 'border-b border-gray-100 mb-2'}`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 flex items-center justify-center text-purple-700 font-bold border border-purple-50">
              {item.author?.first_name?.[0] || 'U'}
            </div>
            {item.author?.role === 'teacher' && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-white">
                Pro
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900 text-sm">{item.author?.first_name} {item.author?.last_name}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">{formatTimeAgo(item.created_at)}</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {item.subject?.name} 
              {item.chapter && (
                 <>
                   <span className="text-gray-300">•</span> {item.chapter.title}
                 </>
              )}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      <div 
        className={`px-4 pb-2 ${!isDetailView ? 'cursor-pointer' : ''}`}
        onClick={handleContentClick}
      >
        {renderContent()}
      </div>

      {/* Stats Row */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 mt-1">
         <div className="flex items-center gap-4">
             {item.likes_count > 0 && (
                <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {item.likes_count} likes
                </span>
             )}
         </div>
         <div className="flex items-center gap-3">
             {item.comments_count > 0 && <span>{item.comments_count} comments</span>}
             {item.shares_count > 0 && <span>{item.shares_count} shares</span>}
         </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-2 flex items-center justify-between border-t border-gray-50 mt-1">
        <ActionButton 
            icon={Heart} 
            label={item.likes_count > 0 ? item.likes_count.toString() : 'Like'} 
            isActive={item.is_liked}
            activeColor="text-red-500"
            onClick={() => onLike(item.id, item.is_liked)}
        />
        <ActionButton 
            icon={MessageCircle} 
            label={item.comments_count > 0 ? item.comments_count.toString() : 'Comment'} 
            onClick={() => !isDetailView && onContentClick && onContentClick(item)}
        />
        <ActionButton 
            icon={Bookmark} 
            label={item.is_bookmarked ? 'Saved' : 'Save'} 
            isActive={item.is_bookmarked}
            activeColor="text-yellow-500 fill-yellow-500"
            onClick={() => onBookmark(item.id, item.is_bookmarked)}
        />
        <ActionButton 
            icon={Share2} 
            label="Share" 
            onClick={() => onShare(item.id)}
        />
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, isActive, activeColor = 'text-purple-600', onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all active:scale-95 ${isActive ? activeColor : 'text-gray-600 hover:bg-gray-50'}`}
        >
            <Icon className={`w-5 h-5 ${isActive && activeColor.includes('fill') ? 'fill-current' : ''}`} />
            {/* <span className="text-sm font-medium">{label}</span> */}
        </button>
    )
}

function NoteContent({ note, showFull }: { note: Note; showFull: boolean }) {
  // Quick revision logic: If there is a summary, show that prominently first
  const hasSummary = !!note.summary;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-900 text-lg leading-tight">{note.title}</h3>
      
      {/* Revision Card Style for Summary */}
      {hasSummary && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
            <div className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Quick Revision
            </div>
            <p className="text-gray-800 text-sm font-medium">{note.summary}</p>
        </div>
      )}

      <div className={`text-gray-700 text-sm leading-relaxed whitespace-pre-wrap ${!showFull && !hasSummary ? 'line-clamp-4' : ''}`}>
        {showFull ? note.content : (hasSummary ? null : note.content)}
      </div>
      
      {!showFull && hasSummary && (
         <p className="text-xs text-gray-500 italic">Tap to read full note...</p>
      )}

      {note.media_urls && note.media_urls.length > 0 && (
        <div className={`mt-3 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 ${note.media_urls.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''}`}>
          {note.media_urls.slice(0, 4).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Media ${idx + 1}`}
              className={`w-full object-cover ${note.media_urls!.length > 1 ? 'h-32' : 'h-64'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuizContent({ quiz }: { quiz: Quiz }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
      <div className="flex items-start justify-between mb-4">
        <div>
           <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 mb-2 uppercase tracking-wide">
             Daily Quiz
           </span>
           <h3 className="text-gray-900 font-bold text-base">{quiz.title}</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
            <CheckCircle className="w-5 h-5" />
        </div>
      </div>
      
      {quiz.description && (
         <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
      )}

      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 font-medium">
         <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-100">
             ❓ {quiz.questions.length} Questions
         </span>
         {quiz.duration_minutes && (
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-100">
                ⏱️ {quiz.duration_minutes} mins
            </span>
         )}
      </div>

      <button className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-200">
        Start Quiz
      </button>
    </div>
  );
}

function PollContent({ poll, itemId, userResponse }: { poll: Poll; itemId: string; userResponse?: string }) {
  const { strings } = useLocalization();
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userResponse);

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = async (optionId: string) => {
    if (selectedOption) return; // Already voted
    setSelectedOption(optionId);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <h3 className="text-gray-900 font-bold mb-4">{poll.question}</h3>
      
      <div className="space-y-2.5">
        {poll.options.map(option => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const isSelected = selectedOption === option.id;
          const hasVoted = !!selectedOption;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={`w-full text-left p-3 rounded-lg border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-purple-500 bg-purple-50'
                  : hasVoted
                  ? 'border-gray-100 bg-gray-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              {hasVoted && (
                <div
                  className={`absolute inset-y-0 left-0 opacity-20 transition-all duration-1000 ${isSelected ? 'bg-purple-500' : 'bg-gray-400'}`}
                  style={{ width: `${percentage}%` }}
                />
              )}
              <div className="relative flex items-center justify-between z-10">
                <span className={`text-sm ${isSelected ? 'font-semibold text-purple-900' : 'text-gray-700'}`}>
                    {option.text}
                </span>
                {hasVoted && (
                  <span className="text-xs font-medium text-gray-500">{Math.round(percentage)}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">
          {totalVotes} votes • {poll.expires_at ? 'Ends soon' : 'Final results'}
      </p>
    </div>
  );
}

// Utility for time ago
function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
}
