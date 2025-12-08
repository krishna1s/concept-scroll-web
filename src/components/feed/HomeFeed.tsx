import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalization } from '../../services/localization/LocalizationProvider';
import { apiClient } from '../../services/api';
import { ContentItem } from '../../types';
import { MOCK_FEED_ITEMS, MOCK_STORIES } from '../../services/mock/mockData';
import { FeedCard } from './FeedCard';
import { FeedItemDetail } from './FeedItemDetail';
import { FlashcardDeck } from './FlashcardDeck';
import { Plus, Layers, Flame } from 'lucide-react';
import { ConceptScrollLoader } from '../ui/ConceptScrollLoader';

export function HomeFeed() {
  const { strings } = useLocalization();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [stories, setStories] = useState(MOCK_STORIES);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [viewMode, setViewMode] = useState<'feed' | 'flashcards'>('feed');
  const [streakDays, setStreakDays] = useState(12); // Mock streak
  
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFeed();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore, isLoading]);

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from real API
      try {
        const response = await apiClient.getHomeFeed(1, 10);
        if (response.items && response.items.length > 0) {
          setItems(response.items);
          setHasMore(response.has_more);
          setPage(1);
        } else {
          // If API returns empty, throw to trigger fallback
          throw new Error("Empty feed from API");
        }
      } catch (apiError) {
        console.warn('Failed to fetch from API or empty feed, falling back to mock data', apiError);
        // Fallback to Mock Data
        await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay for better UX
        setItems(MOCK_FEED_ITEMS);
        setHasMore(true); 
        setPage(1);
      }
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      
      try {
        const response = await apiClient.getHomeFeed(nextPage, 10);
        setItems(prev => [...prev, ...response.items]);
        setHasMore(response.has_more);
        setPage(nextPage);
      } catch (apiError) {
        // Fallback mock logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newItems = MOCK_FEED_ITEMS.map(item => ({
            ...item,
            id: `${item.id}_page${nextPage}`
        }));
        setItems(prev => [...prev, ...newItems]);
        if (nextPage >= 3) setHasMore(false);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const updateItemInList = (itemId: string, updates: Partial<ContentItem>) => {
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, ...updates } : item));
      if (selectedItem && selectedItem.id === itemId) {
          setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
      }
  };

  const handleLike = async (itemId: string, isLiked: boolean) => {
    try {
      // Optimistically update UI
      const currentItem = items.find(i => i.id === itemId);
      if (!currentItem) return;

      const newIsLiked = !isLiked;
      const newCount = isLiked ? Math.max(0, currentItem.likes_count - 1) : currentItem.likes_count + 1;

      updateItemInList(itemId, {
          is_liked: newIsLiked,
          likes_count: newCount
      });

      // Call API
      if (isLiked) {
        await apiClient.unlikeContent(itemId);
      } else {
        await apiClient.likeContent(itemId);
      }
    } catch (error) {
      console.error('Failed to like/unlike:', error);
      // Revert UI on error could be added here
    }
  };

  const handleBookmark = async (itemId: string, isBookmarked: boolean) => {
    try {
      const currentItem = items.find(i => i.id === itemId);
      if (!currentItem) return;

      const newIsBookmarked = !isBookmarked;
      const newCount = isBookmarked ? Math.max(0, currentItem.bookmarks_count - 1) : currentItem.bookmarks_count + 1;

      updateItemInList(itemId, {
          is_bookmarked: newIsBookmarked,
          bookmarks_count: newCount
      });

      // Simple Toast
      const msg = !isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks';
      console.log(msg);

      // Call API
      if (isBookmarked) {
        await apiClient.unbookmarkContent(itemId);
      } else {
        await apiClient.bookmarkContent(itemId);
      }
    } catch (error) {
      console.error('Failed to bookmark/unbookmark:', error);
    }
  };

  const handleShare = async (itemId: string) => {
    try {
      // Update share count locally
      updateItemInList(itemId, {
          shares_count: (items.find(i => i.id === itemId)?.shares_count || 0) + 1
      });

      const link = `${window.location.origin}/content/${itemId}`;

      // Try modern clipboard API first
      try {
        await navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        // Fallback for permissions policy blocks or insecure contexts
        const textArea = document.createElement("textarea");
        textArea.value = link;
        
        // Ensure it's not visible but part of the DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            alert('Link copied to clipboard!');
          } else {
            throw new Error('Fallback copy failed');
          }
        } catch (err) {
          console.error('Fallback copy failed', err);
          alert(`Could not copy link. Here it is: ${link}`);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  if (selectedItem) {
      return (
          <FeedItemDetail 
            item={selectedItem} 
            onBack={() => setSelectedItem(null)}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
      );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ConceptScrollLoader size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-gray-900 mb-2">{strings.feed.noContent}</h2>
        <p className="text-gray-600">Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Sticky Header with Streak & Toggle */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full font-bold text-sm border border-orange-100">
               <Flame className="w-4 h-4 fill-orange-500" />
               <span>{streakDays} Day Streak</span>
            </div>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
             <button 
               onClick={() => setViewMode('feed')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'feed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
             >
               Feed
             </button>
             <button 
               onClick={() => setViewMode('flashcards')}
               className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'flashcards' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
             >
               <Layers className="w-3.5 h-3.5" />
               Revise
             </button>
          </div>
        </div>
      </div>

      {viewMode === 'flashcards' ? (
        <div className="py-8 px-4 animate-in fade-in zoom-in-95 duration-300">
          <FlashcardDeck items={items} onNext={loadMore} />
        </div>
      ) : (
        <>
          {/* Stories Tray */}
          <div className="bg-white p-4 mb-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4">
              {/* Add Story Button */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-600">Add Story</span>
              </div>

              {/* Story Items */}
              {stories.map((story) => (
                <div 
                  key={story.id} 
                  className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                  onClick={() => alert(`Viewing story by ${story.user_name}`)}
                >
                  <div className={`p-[2px] rounded-full ${story.is_viewed ? 'bg-gray-200' : 'bg-gradient-to-tr from-yellow-400 to-purple-600'}`}>
                    <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                      <img src={story.user_avatar} alt={story.user_name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-900 truncate w-16 text-center">{story.user_name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feed Items */}
          <div className="space-y-0 min-h-screen">
            {items.map(item => (
              <FeedCard
                key={item.id}
                item={item}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onShare={handleShare}
                onContentClick={setSelectedItem}
              />
            ))}
          </div>

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="flex items-center justify-center py-8">
              <ConceptScrollLoader size="sm" />
            </div>
          )}

          {/* Intersection Observer Target */}
          <div ref={observerTarget} className="h-4" />

          {/* End of Feed */}
          {!hasMore && items.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              You&apos;re all caught up! 🎉
            </div>
          )}
        </>
      )}
    </div>
  );
}
