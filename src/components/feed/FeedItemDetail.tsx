import React, { useState, useEffect } from 'react';
import { ContentItem, Note, Quiz, Poll, Comment } from '../../types';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { apiClient } from '../../services/api';
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { FeedCard } from './FeedCard';
import { ConceptScrollLoader } from '../ui/ConceptScrollLoader';

interface FeedItemDetailProps {
  item: ContentItem;
  onBack: () => void;
  onLike: (itemId: string, isLiked: boolean) => void;
  onBookmark: (itemId: string, isBookmarked: boolean) => void;
  onShare: (itemId: string) => void;
}

export function FeedItemDetail({ item, onBack, onLike, onBookmark, onShare }: FeedItemDetailProps) {
  const { strings } = useLocalization();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    loadComments();
  }, [item.id]);

  const loadComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await apiClient.getComments(item.id);
      setComments(response.items);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      // Optimistic update (optional, but good for UX, though we need full object)
      // Since we need UserProfile for the comment, it's harder to be fully optimistic without mock
      // So we'll just wait for API response
      
      const newComment = await apiClient.addComment(item.id, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom-10 duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">Post</h2>
        </div>
        <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
        {/* Main Content Card (reusing FeedCard structure but simplified/expanded) */}
        <div className="bg-white mb-2">
           <FeedCard 
             item={item} 
             onLike={onLike} 
             onBookmark={onBookmark} 
             onShare={onShare}
             isDetailView={true}
           />
        </div>

        {/* Comments Section */}
        <div className="bg-white min-h-[300px] p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Comments ({comments.length})</h3>
          
          {isLoadingComments ? (
             <div className="flex justify-center py-8">
               <ConceptScrollLoader size="md" />
             </div>
          ) : (
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0 overflow-hidden">
                    {comment.user.profile_picture ? (
                        <img src={comment.user.profile_picture} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span>{comment.user.first_name?.[0] || 'U'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 px-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">{comment.user.first_name} {comment.user.last_name}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 ml-2">
                      <button className="text-xs font-medium text-gray-500 hover:text-gray-900">Like</button>
                      <button className="text-xs font-medium text-gray-500 hover:text-gray-900">Reply</button>
                      {comment.likes_count > 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-gray-400" /> {comment.likes_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                  <p className="text-center text-gray-400 py-8 text-sm">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="border-t border-gray-200 bg-white p-3 pb-8 safe-area-bottom">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-500"
            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
          />
          <button 
            onClick={handlePostComment}
            disabled={!commentText.trim()}
            className={`p-2 rounded-full transition-all ${
              commentText.trim() 
                ? 'text-purple-600 bg-purple-100 hover:bg-purple-200' 
                : 'text-gray-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
