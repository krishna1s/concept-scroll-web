/**
 * Supabase Implementation of API Contract
 * 
 * This adapter implements the IApiClient interface using Supabase as the backend.
 * It maps the Django REST API schema to Supabase tables and RPC calls.
 * 
 * When migrating to your Django backend, you can create a new adapter
 * (e.g., djangoClient.ts) that implements the same IApiClient interface.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IApiClient } from './contract';
import {
  User,
  UserProfile,
  AuthTokens,
  OnboardingPreferences,
  Board,
  Class,
  Medium,
  Subject,
  Book,
  Chapter,
  ContentItem,
  Note,
  Quiz,
  Poll,
  PollResponse,
  Comment,
  Like,
  Bookmark,
  Follow,
  UserGoal,
  QuizHistory,
  FocusSession,
  UserChallengeProgress,
  FeedFilters,
  FeedFilterOptions,
  PaginatedResponse,
  QuizAnswer,
  ContentType,
} from '../../types';

export class SupabaseApiClient implements IApiClient {
  private supabase: SupabaseClient;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  // ==================== Authentication ====================
  
  async requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    // Use Supabase's native phone authentication with Twilio
    console.log(`📱 Requesting OTP via Supabase Twilio for: ${phoneNumber}`);
    
    const { data, error } = await this.supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    
    if (error) {
      console.error('❌ Error sending OTP via Twilio:', error);
      throw error;
    }
    
    console.log('✅ OTP sent via Twilio to:', phoneNumber);
    return { 
      success: true, 
      message: `OTP sent to ${phoneNumber} via SMS` 
    };
  }
  
  async verifyOTP(
    phoneNumber: string, 
    otpCode: string,
    profile?: { first_name: string; last_name: string; email?: string }
  ): Promise<AuthTokens> {
    console.log(`🔐 Verifying OTP via Supabase Twilio for: ${phoneNumber}`);
    
    // Verify OTP using Supabase's native phone verification
    const { data, error } = await this.supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otpCode,
      type: 'sms',
    });
    
    if (error || !data.session) {
      console.error('❌ OTP Verification Failed:', error);
      throw error || new Error('Invalid or expired OTP');
    }
    
    console.log('✅ OTP Verified Successfully via Twilio');
    
    // Check if user profile exists
    const { data: existingProfile } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    // If profile data is provided and user profile doesn't exist, create it (SIGNUP)
    if (profile && !existingProfile) {
      console.log('📝 Creating new user profile');
      
      await this.supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email, // Store real email if provided
          phone_number: phoneNumber,
        });
      
      // Update user metadata
      await this.supabase.auth.updateUser({
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
      });
    }
    
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: this.mapAuthUser(data.user),
    };
  }
  
  async login(phoneNumber: string, password: string): Promise<AuthTokens> {
    // For Supabase: use phone as email format for compatibility
    // In production: migrate to custom phone auth or use Supabase phone auth
    const sanitizedPhone = phoneNumber.replace(/\+/g, '');
    
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: `user${sanitizedPhone}@noreply.local`,
      password,
    });
    
    if (error || !data.session) throw error || new Error('Login failed');
    
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: this.mapAuthUser(data.user),
    };
  }
  
  async googleLogin(idToken: string): Promise<AuthTokens> {
    // Supabase handles Google OAuth differently
    const { data, error } = await this.supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    
    if (error || !data.session) throw error || new Error('Google login failed');
    
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: this.mapAuthUser(data.user),
    };
  }
  
  async signUp(
    phoneNumber: string, 
    password: string, 
    profile: { first_name: string; last_name: string; email?: string }
  ): Promise<AuthTokens> {
    // For Supabase: use phone as email format if no email provided
    const sanitizedPhone = phoneNumber.replace(/\+/g, '');
    const emailToUse = profile.email || `user${sanitizedPhone}@noreply.local`;
    
    const { data, error } = await this.supabase.auth.signUp({
      email: emailToUse,
      password,
      options: {
        data: {
          phone_number: phoneNumber,
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
      },
    });
    
    if (error || !data.session) throw error || new Error('Sign up failed');
    
    // Create user profile
    if (profile.first_name || profile.last_name) {
      await this.supabase
        .from('user_profiles')
        .insert({
          user_id: data.user!.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          bio: profile.bio,
        });
    }
    
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: this.mapAuthUser(data.user!),
    };
  }
  
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }
  
  async getSession(): Promise<{ user: User | null; accessToken: string | null }> {
    const { data: { session } } = await this.supabase.auth.getSession();
    
    if (!session) {
      return { user: null, accessToken: null };
    }
    
    return {
      user: this.mapAuthUser(session.user),
      accessToken: session.access_token,
    };
  }
  
  // ==================== User Profile ====================
  
  async getProfile(): Promise<UserProfile> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*, followers:follows!following_id(count), following:follows!follower_id(count)')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return {
      id: user.id,
      email: data?.email, // Get from user_profiles table, not auth (to avoid fake email)
      phone_number: user.user_metadata?.phone_number,
      first_name: data?.first_name || user.user_metadata?.first_name,
      last_name: data?.last_name || user.user_metadata?.last_name,
      profile_picture: data?.profile_picture || user.user_metadata?.profile_picture,
      bio: data?.bio,
      followers_count: data?.followers?.[0]?.count || 0,
      following_count: data?.following?.[0]?.count || 0,
      created_at: user.created_at,
      updated_at: data?.updated_at || user.created_at,
    };
  }
  
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Update auth metadata if needed
    if (updates.email) {
      await this.supabase.auth.updateUser({ email: updates.email });
    }
    
    // Update profile table
    const { error } = await this.supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        first_name: updates.first_name,
        last_name: updates.last_name,
        email: updates.email,
        bio: updates.bio,
        profile_picture: updates.profile_picture,
        updated_at: new Date().toISOString(),
      });
    
    if (error) throw error;
    
    return this.getProfile();
  }
  
  async getUserProfile(userId: string): Promise<UserProfile> {
    const { data: { user: currentUser } } = await this.supabase.auth.getUser();
    
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select(`
        *,
        followers:follows!following_id(count),
        following:follows!follower_id(count)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    // Check if current user follows this user
    let isFollowing = false;
    if (currentUser) {
      const { data: followData } = await this.supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUser.id)
        .eq('following_id', userId)
        .single();
      isFollowing = !!followData;
    }
    
    return {
      id: userId,
      first_name: data.first_name,
      last_name: data.last_name,
      profile_picture: data.profile_picture,
      bio: data.bio,
      followers_count: data.followers?.[0]?.count || 0,
      following_count: data.following?.[0]?.count || 0,
      is_following: isFollowing,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
  
  // ==================== Onboarding ====================
  
  async getOnboardingPreferences(): Promise<OnboardingPreferences | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('user_onboarding_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code === 'PGRST116') return null; // Not found
    if (error) throw error;
    
    return data;
  }
  
  async saveOnboardingPreferences(preferences: Partial<OnboardingPreferences>): Promise<OnboardingPreferences> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('user_onboarding_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async updateOnboardingStep(step: Partial<OnboardingPreferences>): Promise<OnboardingPreferences> {
    return this.saveOnboardingPreferences(step);
  }
  
  // ==================== Educational Structure ====================
  
  async getBoards(): Promise<Board[]> {
    const { data, error } = await this.supabase
      .from('boards')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
  
  async getClasses(boardId?: string): Promise<Class[]> {
    let query = this.supabase
      .from('classes')
      .select('*')
      .eq('is_active', true);
    
    if (boardId) {
      query = query.eq('board_id', boardId);
    }
    
    const { data, error } = await query.order('grade_number');
    
    if (error) throw error;
    return data || [];
  }
  
  async getMediums(): Promise<Medium[]> {
    const { data, error } = await this.supabase
      .from('mediums')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
  
  async getSubjects(classId: string, boardId?: string): Promise<Subject[]> {
    let query = this.supabase
      .from('subjects')
      .select('*')
      .eq('is_active', true)
      .eq('class_id', classId);
    
    // Note: subjects table doesn't have board_id - board is linked through class
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data || [];
  }
  
  async getBooks(filters: { subjectId?: string; classId?: string; mediumId?: string }): Promise<Book[]> {
    let query = this.supabase
      .from('books')
      .select('*')
      .eq('is_active', true);
    
    if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);
    if (filters.classId) query = query.eq('class_id', filters.classId);
    if (filters.mediumId) query = query.eq('medium_id', filters.mediumId);
    
    const { data, error } = await query.order('title');
    
    if (error) throw error;
    return data || [];
  }
  
  async getChapters(bookId: string): Promise<Chapter[]> {
    const { data, error } = await this.supabase
      .from('chapters')
      .select(`
        *,
        notes:notes(count),
        quizzes:quizzes(count)
      `)
      .eq('book_id', bookId)
      .eq('is_active', true)
      .order('chapter_number');
    
    if (error) throw error;
    
    return (data || []).map(ch => ({
      ...ch,
      notes_count: ch.notes?.[0]?.count || 0,
      quizzes_count: ch.quizzes?.[0]?.count || 0,
    }));
  }
  
  async getChapter(chapterId: string): Promise<Chapter> {
    const { data, error } = await this.supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // ==================== Feed System ====================
  
  async getHomeFeed(page: number, size: number): Promise<PaginatedResponse<ContentItem>> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    // Get user's preferences to personalize feed
    let subjectIds: string[] = [];
    if (user) {
      const prefs = await this.getOnboardingPreferences();
      subjectIds = prefs?.subject_ids || [];
    }
    
    const from = (page - 1) * size;
    const to = from + size - 1;
    
    let query = this.supabase
      .from('content_items')
      .select(`
        *,
        notes(*),
        quizzes(*),
        polls(*),
        author:user_profiles!author_id(*),
        chapter:chapters(*),
        subject:subjects(*),
        likes(count),
        comments(count),
        bookmarks(count)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    
    // Filter by user's subjects if available
    if (subjectIds.length > 0) {
      query = query.in('subject_id', subjectIds);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    const items = await this.mapContentItems(data || [], user?.id);
    
    return {
      items,
      total: count || 0,
      page,
      size,
      has_more: (count || 0) > page * size,
    };
  }
  
  async getExploreFeed(page: number, size: number, filters?: FeedFilters): Promise<PaginatedResponse<ContentItem>> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    const from = (page - 1) * size;
    const to = from + size - 1;
    
    let query = this.supabase
      .from('content_items')
      .select(`
        *,
        notes(*),
        quizzes(*),
        polls(*),
        author:user_profiles!author_id(*),
        chapter:chapters(*),
        subject:subjects(*),
        likes(count),
        comments(count),
        bookmarks(count)
      `, { count: 'exact' });
    
    // Apply filters
    if (filters?.subjects && filters.subjects.length > 0) {
      query = query.in('subject_id', filters.subjects);
    }
    if (filters?.types && filters.types.length > 0) {
      query = query.in('type', filters.types);
    }
    if (filters?.chapters && filters.chapters.length > 0) {
      query = query.in('chapter_id', filters.chapters);
    }
    
    // Apply sorting
    switch (filters?.sort_by) {
      case 'popular':
        query = query.order('likes_count', { ascending: false });
        break;
      case 'trending':
        // Simple trending: recent + popular
        query = query.order('likes_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }
    
    const { data, error, count } = await query.range(from, to);
    
    if (error) throw error;
    
    const items = await this.mapContentItems(data || [], user?.id);
    
    return {
      items,
      total: count || 0,
      page,
      size,
      has_more: (count || 0) > page * size,
    };
  }
  
  async getBookmarkedFeed(page: number, size: number): Promise<PaginatedResponse<ContentItem>> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const from = (page - 1) * size;
    const to = from + size - 1;
    
    const { data, error, count } = await this.supabase
      .from('bookmarks')
      .select(`
        content_item:content_items(
          *,
          notes(*),
          quizzes(*),
          polls(*),
          author:user_profiles!author_id(*),
          chapter:chapters(*),
          subject:subjects(*),
          likes(count),
          comments(count),
          bookmarks(count)
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    const contentItems = (data || []).map(b => b.content_item).filter(Boolean);
    const items = await this.mapContentItems(contentItems, user.id);
    
    return {
      items,
      total: count || 0,
      page,
      size,
      has_more: (count || 0) > page * size,
    };
  }
  
  async getFeedFilterOptions(): Promise<FeedFilterOptions> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    let subjects: Subject[] = [];
    let chapters: Chapter[] = [];
    
    if (user) {
      const prefs = await this.getOnboardingPreferences();
      if (prefs?.subject_ids && prefs.subject_ids.length > 0) {
        const { data } = await this.supabase
          .from('subjects')
          .select('*')
          .in('id', prefs.subject_ids);
        subjects = data || [];
      }
      
      if (prefs?.class_id) {
        const books = await this.getBooks({ classId: prefs.class_id });
        if (books.length > 0) {
          const { data } = await this.supabase
            .from('chapters')
            .select('*')
            .in('book_id', books.map(b => b.id))
            .limit(50);
          chapters = data || [];
        }
      }
    }
    
    return {
      subjects,
      chapters,
      types: ['note', 'quiz', 'poll'],
    };
  }
  
  async getContentItem(id: string): Promise<ContentItem> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    const { data, error } = await this.supabase
      .from('content_items')
      .select(`
        *,
        notes(*),
        quizzes(*),
        polls(*),
        author:user_profiles!author_id(*),
        chapter:chapters(*),
        subject:subjects(*),
        likes(count),
        comments(count),
        bookmarks(count)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const items = await this.mapContentItems([data], user?.id);
    return items[0];
  }
  
  // ==================== Interactions ====================
  
  async likeContent(contentItemId: string): Promise<Like> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('likes')
      .insert({ content_item_id: contentItemId, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    
    // Increment like count
    await this.supabase.rpc('increment_likes_count', { content_item_id: contentItemId });
    
    return data;
  }
  
  async unlikeContent(contentItemId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await this.supabase
      .from('likes')
      .delete()
      .eq('content_item_id', contentItemId)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    // Decrement like count
    await this.supabase.rpc('decrement_likes_count', { content_item_id: contentItemId });
  }
  
  async bookmarkContent(contentItemId: string): Promise<Bookmark> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('bookmarks')
      .insert({ content_item_id: contentItemId, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    
    await this.supabase.rpc('increment_bookmarks_count', { content_item_id: contentItemId });
    
    return data;
  }
  
  async unbookmarkContent(contentItemId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await this.supabase
      .from('bookmarks')
      .delete()
      .eq('content_item_id', contentItemId)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    await this.supabase.rpc('decrement_bookmarks_count', { content_item_id: contentItemId });
  }
  
  async addComment(contentItemId: string, text: string, parentCommentId?: string): Promise<Comment> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('comments')
      .insert({
        content_item_id: contentItemId,
        user_id: user.id,
        text,
        parent_comment_id: parentCommentId,
      })
      .select(`
        *,
        user:user_profiles(*)
      `)
      .single();
    
    if (error) throw error;
    
    await this.supabase.rpc('increment_comments_count', { content_item_id: contentItemId });
    
    return {
      ...data,
      user: data.user,
      replies_count: 0,
      likes_count: 0,
      is_liked: false,
    };
  }
  
  async getComments(contentItemId: string, page: number, size: number): Promise<PaginatedResponse<Comment>> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    const from = (page - 1) * size;
    const to = from + size - 1;
    
    const { data, error, count } = await this.supabase
      .from('comments')
      .select(`
        *,
        user:user_profiles(*),
        replies:comments!parent_comment_id(count)
      `, { count: 'exact' })
      .eq('content_item_id', contentItemId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    const comments = (data || []).map(comment => ({
      ...comment,
      user: comment.user,
      replies_count: comment.replies?.[0]?.count || 0,
      likes_count: 0,
      is_liked: false,
    }));
    
    return {
      items: comments,
      total: count || 0,
      page,
      size,
      has_more: (count || 0) > page * size,
    };
  }
  
  async deleteComment(commentId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await this.supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id);
    
    if (error) throw error;
  }
  
  async shareContent(contentItemId: string): Promise<void> {
    await this.supabase.rpc('increment_shares_count', { content_item_id: contentItemId });
  }
  
  async votePoll(pollId: string, optionId: string): Promise<PollResponse> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('poll_responses')
      .insert({
        poll_id: pollId,
        user_id: user.id,
        option_id: optionId,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Increment vote count for the option
    await this.supabase.rpc('increment_poll_option_votes', { option_id: optionId });
    
    return data;
  }
  
  // ==================== Social ====================
  
  async followUser(userId: string): Promise<Follow> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('follows')
      .insert({ follower_id: user.id, following_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async unfollowUser(userId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await this.supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', userId);
    
    if (error) throw error;
  }
  
  async getFollowers(userId: string, page: number, size: number): Promise<PaginatedResponse<UserProfile>> {
    const from = (page - 1) * size;
    const to = from + size - 1;
    
    const { data, error, count } = await this.supabase
      .from('follows')
      .select('follower:user_profiles!follower_id(*)', { count: 'exact' })
      .eq('following_id', userId)
      .range(from, to);
    
    if (error) throw error;
    
    const profiles = (data || []).map(f => ({
      ...f.follower,
      followers_count: 0,
      following_count: 0,
    }));
    
    return {
      items: profiles,
      total: count || 0,
      page,
      size,
      has_more: (count || 0) > page * size,
    };
  }
  
  async getFollowing(userId: string, page: number, size: number): Promise<PaginatedResponse<UserProfile>> {
    const from = (page - 1) * size;
    const to = from + size - 1;
    
    const { data, error, count } = await this.supabase
      .from('follows')
      .select('following:user_profiles!following_id(*)', { count: 'exact' })
      .eq('follower_id', userId)
      .range(from, to);
    
    if (error) throw error;
    
    const profiles = (data || []).map(f => ({
      ...f.following,
      followers_count: 0,
      following_count: 0,
    }));
    
    return {
      items: profiles,
      total: count || 0,
      page,
      size,
      has_more: (count || 0) > page * size,
    };
  }
  
  // ==================== Library ====================
  
  async getChapterNotes(chapterId: string): Promise<Note[]> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  async getChapterQuizzes(chapterId: string): Promise<Quiz[]> {
    const { data, error } = await this.supabase
      .from('quizzes')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  async getChapterQA(chapterId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('qa_items')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  // ==================== Gamification ====================
  
  async getUserGoals(date?: string): Promise<UserGoal[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    let query = this.supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id);
    
    if (date) {
      query = query.eq('date', date);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  async getTodayGoal(): Promise<UserGoal | null> {
    const today = new Date().toISOString().split('T')[0];
    const goals = await this.getUserGoals(today);
    return goals[0] || null;
  }
  
  async createGoal(goal: Partial<UserGoal>): Promise<UserGoal> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('user_goals')
      .insert({ ...goal, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async updateGoalProgress(goalId: string, currentValue: number): Promise<UserGoal> {
    const { data, error } = await this.supabase
      .from('user_goals')
      .update({ current_value: currentValue })
      .eq('id', goalId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async getQuizHistory(page: number, size: number): Promise<PaginatedResponse<QuizHistory>> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const from = (page - 1) * size;
    const to = from + size - 1;
    
    const { data, error, count } = await this.supabase
      .from('quiz_history')
      .select('*, quiz:quizzes(*)', { count: 'exact' })
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      items: data || [],
      total: count || 0,
      page,
      size,
      has_more: (count || 0) > page * size,
    };
  }
  
  async submitQuiz(quizId: string, answers: QuizAnswer[], timeTaken: number): Promise<QuizHistory> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const correctAnswers = answers.filter(a => a.is_correct).length;
    
    const { data, error } = await this.supabase
      .from('quiz_history')
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        score: correctAnswers,
        total_questions: answers.length,
        time_taken_seconds: timeTaken,
        answers,
        completed_at: new Date().toISOString(),
      })
      .select('*, quiz:quizzes(*)')
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async getFocusSessions(page: number, size: number): Promise<PaginatedResponse<FocusSession>> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const from = (page - 1) * size;
    const to = from + size - 1;
    
    const { data, error, count } = await this.supabase
      .from('focus_sessions')
      .select('*, chapter:chapters(*)', { count: 'exact' })
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      items: data || [],
      total: count || 0,
      page,
      size,
      has_more: (count || 0) > page * size,
    };
  }
  
  async createFocusSession(chapterId: string, durationMinutes: number): Promise<FocusSession> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const startedAt = new Date();
    const endedAt = new Date(startedAt.getTime() + durationMinutes * 60000);
    
    const { data, error } = await this.supabase
      .from('focus_sessions')
      .insert({
        user_id: user.id,
        chapter_id: chapterId,
        duration_minutes: durationMinutes,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
      })
      .select('*, chapter:chapters(*)')
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async getUserChallenges(): Promise<UserChallengeProgress[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await this.supabase
      .from('user_challenge_progress')
      .select('*, challenge:challenges(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  async getLatestChallenge(): Promise<UserChallengeProgress | null> {
    const challenges = await this.getUserChallenges();
    return challenges[0] || null;
  }
  
  // ==================== Tracking ====================
  
  async markContentSeen(contentItemId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    await this.supabase
      .from('content_seen')
      .insert({ user_id: user.id, content_item_id: contentItemId });
  }
  
  async getSeenContent(page: number, size: number): Promise<PaginatedResponse<string>> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const from = (page - 1) * size;
    const to = from + size - 1;
    
    const { data, error, count } = await this.supabase
      .from('content_seen')
      .select('content_item_id', { count: 'exact' })
      .eq('user_id', user.id)
      .range(from, to);
    
    if (error) throw error;
    
    return {
      items: (data || []).map(d => d.content_item_id),
      total: count || 0,
      page,
      size,
      has_more: (count || 0) > page * size,
    };
  }
  
  // ==================== Helper Methods ====================
  
  private mapAuthUser(user: any): User {
    return {
      id: user.id,
      email: user.email,
      phone_number: user.user_metadata?.phone_number,
      first_name: user.user_metadata?.first_name,
      last_name: user.user_metadata?.last_name,
      profile_picture: user.user_metadata?.profile_picture,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  }
  
  private async mapContentItems(data: any[], userId?: string): Promise<ContentItem[]> {
    const items: ContentItem[] = [];
    
    for (const item of data) {
      let content;
      if (item.type === 'note' && item.notes) {
        content = Array.isArray(item.notes) ? item.notes[0] : item.notes;
      } else if (item.type === 'quiz' && item.quizzes) {
        content = Array.isArray(item.quizzes) ? item.quizzes[0] : item.quizzes;
      } else if (item.type === 'poll' && item.polls) {
        content = Array.isArray(item.polls) ? item.polls[0] : item.polls;
      }
      
      if (!content) continue;
      
      // Check user interactions
      let isLiked = false;
      let isBookmarked = false;
      let userPollResponse;
      
      if (userId) {
        const { data: likeData } = await this.supabase
          .from('likes')
          .select('id')
          .eq('content_item_id', item.id)
          .eq('user_id', userId)
          .single();
        isLiked = !!likeData;
        
        const { data: bookmarkData } = await this.supabase
          .from('bookmarks')
          .select('id')
          .eq('content_item_id', item.id)
          .eq('user_id', userId)
          .single();
        isBookmarked = !!bookmarkData;
        
        if (item.type === 'poll') {
          const { data: pollData } = await this.supabase
            .from('poll_responses')
            .select('option_id')
            .eq('poll_id', item.id)
            .eq('user_id', userId)
            .single();
          userPollResponse = pollData?.option_id;
        }
      }
      
      items.push({
        id: item.id,
        type: item.type,
        content,
        author: item.author || {},
        chapter: item.chapter,
        subject: item.subject,
        likes_count: item.likes?.[0]?.count || 0,
        comments_count: item.comments?.[0]?.count || 0,
        bookmarks_count: item.bookmarks?.[0]?.count || 0,
        shares_count: item.shares_count || 0,
        is_liked: isLiked,
        is_bookmarked: isBookmarked,
        user_poll_response: userPollResponse,
        created_at: item.created_at,
        updated_at: item.updated_at,
      });
    }
    
    return items;
  }
}