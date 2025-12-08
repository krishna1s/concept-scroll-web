import { API_ENDPOINTS } from '../constants/apiEndpoints';
import {
  Achievement,
  Activity,
  Post,
  Profile,
  Reel
} from '../models/profileModel';
import { apiClient } from './apiClient';
import { logOperation } from '../utils/utils';

/**
 * Service for handling user profile functionality
 */
export const profileService = {
  /**
   * Fetch the user's profile data
   * @param userId User ID (optional, defaults to current user)
   * @returns User profile data
   */
  async getProfile(userId?: string): Promise<Profile | null> {
    logOperation('ProfileService', 'getProfile', `Fetching profile for user ${userId || 'current'}`);
    const endpoint = userId ? `${API_ENDPOINTS.USER_PROFILE}${userId}/` : API_ENDPOINTS.USER_PROFILE;
    const response = await apiClient.get<Profile>(endpoint);
    return response.data || null;
  },
  
  /**
   * Update the user's profile data
   * @param profileData Updated profile data
   * @returns Updated profile
   */
  async updateProfile(profileData: Partial<Profile>): Promise<Profile | null> {
    logOperation('ProfileService', 'updateProfile', 'Updating profile', profileData);
    const response = await apiClient.patch<Profile>(API_ENDPOINTS.USER_PROFILE, profileData);
    return response.data;
  },
  
  /**
   * Fetch user's posts
   * @param userId User ID (optional, defaults to current user)
   * @param page Page number for pagination
   * @returns Array of posts and hasMore flag
   */
  async getPosts(userId?: string, page = 1): Promise<{ posts: Post[], hasMore: boolean }> {
    logOperation('ProfileService', 'getPosts', `Fetching posts for user ${userId || 'current'}, page ${page}`);
    const endpoint = userId ? `${API_ENDPOINTS.USER_PROFILE}${userId}/posts/` : API_ENDPOINTS.USER_POSTS;
    const response = await apiClient.get<{ results: Post[], count: number }>(`${endpoint}?page=${page}`);
    return {
      posts: response.data!.results || [],
      hasMore: response.data!.count === 10 // or use count/pageSize if available
    };
  },
  
  /**
   * Fetch user's reels
   * @param userId User ID (optional, defaults to current user)
   * @param page Page number for pagination
   * @returns Array of reels and hasMore flag
   */
  async getReels(userId?: string, page = 1): Promise<{ reels: Reel[], hasMore: boolean }> {
    logOperation('ProfileService', 'getReels', `Fetching reels for user ${userId || 'current'}, page ${page}`);
    const endpoint = userId ? `${API_ENDPOINTS.USER_PROFILE}${userId}/reels/` : API_ENDPOINTS.USER_REELS;
    const response = await apiClient.get<{ results: Reel[], count: number }>(`${endpoint}?page=${page}`);
    return {
      reels: response.data!.results || [],
      hasMore: response.data!.count === 10 // or use count/pageSize if available
    };
  },
  
  /**
   * Fetch user's achievements
   * @param userId User ID (optional, defaults to current user)
   * @returns Array of achievements
   */
  async getAchievements(userId?: string): Promise<Achievement[] > {
    logOperation('ProfileService', 'getAchievements', `Fetching achievements for user ${userId || 'current'}`);
    const endpoint = userId ? `${API_ENDPOINTS.USER_PROFILE}${userId}/achievements/` : API_ENDPOINTS.USER_ACHIEVEMENTS;
    const response = await apiClient.get<{ results: Achievement[] }>(endpoint);
    return response.data!.results || []
  },
  
  /**
   * Fetch user's saved/bookmarked posts
   * @param page Page number for pagination
   * @returns Array of saved posts and hasMore flag
   */
  async getSavedPosts(page = 1): Promise<{ posts: Post[], hasMore: boolean }> {
    logOperation('ProfileService', 'getSavedPosts', `Fetching saved posts, page ${page}`);
    const response = await apiClient.get<{ results: Post[], count: number }>(`${API_ENDPOINTS.USER_BOOKMARKS}?page=${page}`);
    return {
      posts: response.data!.results || [],
      hasMore: response.data!.count === 10 // or use count/pageSize if available
    };
  },
  
  /**
   * Fetch user's activity data
   * @param userId User ID (optional, defaults to current user)
   * @param days Number of days to fetch (default: 7)
   * @returns Array of daily activity data
   */
  async getActivityData(userId?: string, days = 7): Promise<Activity[] > {
    logOperation('ProfileService', 'getActivityData', `Fetching activity for user ${userId || 'current'}, days: ${days}`);
    const endpoint = userId ? `${API_ENDPOINTS.USER_PROFILE}${userId}/activity/` : API_ENDPOINTS.USER_ACTIVITY;
    const response = await apiClient.get<{ results: Activity[] }>(`${endpoint}?days=${days}`);
    return response.data!.results || [];
  },
  
  /**
   * Follow a user
   * @param userId ID of user to follow
   * @returns Success response
   */
  async followUser(userId: string): Promise<{ success: boolean }> {
    logOperation('ProfileService', 'followUser', `Following user ${userId}`);
    const response = await apiClient.post<{ success: boolean }>(API_ENDPOINTS.USER_FOLLOW, { userId });
    return response.data || { success: false };
  },
  
  /**
   * Unfollow a user
   * @param userId ID of user to unfollow
   * @returns Success response
   */
  async unfollowUser(userId: string): Promise<{ success: boolean }> {
    logOperation('ProfileService', 'unfollowUser', `Unfollowing user ${userId}`);
    const response = await apiClient.post<{ success: boolean }>(API_ENDPOINTS.USER_UNFOLLOW, { userId });
    return response.data || { success: false };
  },
  
  /**
   * Block a user
   * @param userId ID of user to block
   * @returns Success response
   */
  async blockUser(userId: string): Promise<{ success: boolean }> {
    logOperation('ProfileService', 'blockUser', `Blocking user ${userId}`);
    const response = await apiClient.post<{ success: boolean }>(API_ENDPOINTS.USER_BLOCK, { userId });
    return response.data ||  { success: false };
  },
  
  /**
   * Unblock a user
   * @param userId ID of user to unblock
   * @returns Success response
   */
  async unblockUser(userId: string): Promise<{ success: boolean }> {
    logOperation('ProfileService', 'unblockUser', `Unblocking user ${userId}`);
    const response = await apiClient.post<{ success: boolean }>(API_ENDPOINTS.USER_UNBLOCK, { userId });
    return response.data || { success: false };
  },
  
  /**
   * Remove bookmark from a post
   * @param postId ID of post to remove bookmark from
   * @returns Success response
   */
  async removeBookmark(postId: string): Promise<{ success: boolean }> {
    logOperation('ProfileService', 'removeBookmark', `Removing bookmark for post ${postId}`);
    const response = await apiClient.post<{ success: boolean }>(API_ENDPOINTS.USER_REMOVE_BOOKMARK, { postId });
    return response.data || { success: false  };
  },
};