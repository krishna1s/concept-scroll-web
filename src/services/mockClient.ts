// Mock client for simulating API calls
import { delay } from '../utils/utils';

interface MockClientOptions {
  baseDelay?: number;
  variableDelay?: number;
  errorRate?: number;
}

class MockClient {
  private baseDelay: number;
  private variableDelay: number;
  private errorRate: number;

  constructor(options: MockClientOptions = {}) {
    this.baseDelay = options.baseDelay || 300;
    this.variableDelay = options.variableDelay || 200;
    this.errorRate = options.errorRate || 0.0; // Set default error rate to 0 to prevent random errors
  }

  private async simulateNetworkDelay(): Promise<void> {
    const randomDelay = this.baseDelay + Math.random() * this.variableDelay;
    await delay(randomDelay);
  }

  private shouldSimulateError(): boolean {
    return Math.random() < this.errorRate;
  }

  // Helper method to generate synthetic responses
  private generateSyntheticResponse<T, D>(data: D): T {
    return {
      success: true,
      id: 'id' in (data as object) ? (data as Record<string, unknown>).id : `mock-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...data
    } as unknown as T;
  }

  // Log request details (for debugging)
  private logRequest(method: string, url: string, data?: unknown): void {
    // Only log if specifically needed, otherwise keep console clean
    // console.log(`[MOCK] ${method.toUpperCase()} to ${url}`, data ? data : '');
  }

  // Handle case when mock file is not found - DEPRECATED but kept for type safety if needed internally
  private handleMockFileNotFound<T>(url: string, error: unknown): T {
    // console.warn(`Mock file not found for ${url}, using fallback data`);
    
    const fallbackData = this.getFallbackData(url);
    
    return fallbackData as T;
  }

  // Helper method for fallback responses
  private getFallbackData(url: string): unknown {
    // Dashboard-specific fallback data
    if (url.includes('/api/onboarding/user/goals/current/')) {
      return {
        id: "goal-1",
        userId: "user-1",
        date: new Date().toISOString().split('T')[0],
        subjectId: "physics-12",
        subjectName: "Physics",
        chapterId: "chapter-1",
        chapterName: "Kinematics",
        targetMinutes: 60,
        completedMinutes: 45,
        isCompleted: false,
        streak: 7
      };
    }
    
    if (url.includes('/api/onboarding/user/quiz-history/last/')) {
      return {
        id: "quiz-1",
        userId: "user-1",
        score: 8,
        total: 10,
        subject: "Physics",
        chapter: "Kinematics",
        completedAt: new Date().toISOString(),
        timeTaken: 300
      };
    }
    
    if (url.includes('/api/onboarding/user/focus-sessions/last/')) {
      return {
        id: "focus-1",
        userId: "user-1",
        subject: "Mathematics",
        chapter: "Calculus",
        progress: 25,
        duration: 25,
        createdAt: new Date().toISOString()
      };
    }
    
    if (url.includes('/api/onboarding/challenges/latest/')) {
      return {
        id: "challenge-1",
        title: "Math Marathon",
        description: "Complete 5 math quizzes this week",
        type: "weekly",
        reward: "Special badge",
        progress: 3,
        total: 5,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
    
    // Fallback data for specific endpoints
    if (url.includes('/api/chapters/continue')) {
      return [
        { id: 1, subject: 'Mathematics', name: 'Quadratic Equations', progress: 65, due: 'Tomorrow' },
        { id: 2, subject: 'Science', name: 'Chemical Reactions', progress: 40, due: 'In 2 days' },
        { id: 3, subject: 'History', name: 'French Revolution', progress: 80, due: 'Today' },
        { id: 4, subject: 'English', name: 'Poetry Analysis', progress: 30, due: 'In 3 days' }
      ];
    }

    if (url.includes('/api/achievements')) {
      return [
        { icon: '🔥', name: '7-Day Streak', unlocked: true },
        { icon: '⭐', name: 'First Quiz Master', unlocked: true },
        { icon: '🎯', name: '100% Chapter', unlocked: false },
        { icon: '👑', name: 'Leaderboard Top 10', unlocked: false }
      ];
    }
    
    if (url.includes('/explore/feed')) {
      return [
        {
          id: "fallback-1",
          type: "note",
          title: "Fallback Physics Concept",
          subject: "Physics",
          subjectId: "sub-physics",
          content: "This is a fallback content item generated when the mock data couldn't be loaded.",
          tags: ["Physics", "Fallback"],
          likes: 42,
          bookmarks: 7,
          comments: 3,
          isPro: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "fallback-2",
          type: "quiz",
          title: "Fallback Quiz",
          subject: "Mathematics",
          subjectId: "sub-mathematics",
          content: "A quick fallback quiz to test your knowledge.",
          tags: ["Mathematics", "Quiz", "Fallback"],
          likes: 24,
          bookmarks: 5,
          isPro: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
    
    // Specific fallback for user posts
    if (url.includes('/user/posts')) {
      return [
        {
          id: "fallback-post-1",
          userId: "current-user",
          type: "note",
          title: "Fallback User Post",
          content: "This is a fallback post generated when the mock data couldn't be loaded.",
          subject: "General",
          subjectId: "sub-general",
          likes: 15,
          comments: 3,
          shares: 2,
          bookmarks: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ["Fallback", "General"]
        }
      ];
    }
    
    // Default fallback for other endpoints
    const isArray = url.includes('list') || url.includes('all') || url.endsWith('s') || url.includes('posts');
    if (isArray) {
      return [];
    } else {
      return {
        id: `mock-${Date.now()}`,
        success: true,
        message: 'Mock data not found, but request was successful',
        timestamp: new Date().toISOString()
      };
    }
  }

  async get<T>(url: string): Promise<T> {
    await this.simulateNetworkDelay();
    
    // Special handling for critical endpoints to avoid random errors
    const criticalEndpoints = ['/explore/feed', '/feed/posts', '/user/profile', '/user/posts'];
    const isCriticalEndpoint = criticalEndpoints.some(endpoint => url.includes(endpoint));
    
    if (!isCriticalEndpoint && this.shouldSimulateError()) {
      throw new Error(`Network error: Failed to fetch ${url}`);
    }
    
    // For this environment, we just return fallback data directly
    const data = this.getFallbackData(url);
    this.logRequest('get', url, data);
    return data as T;
  }

  async post<T, D>(url: string, data: D): Promise<T> {
    await this.simulateNetworkDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error(`Network error: Failed to post to ${url}`);
    }
    
    this.logRequest('post', url, data);
    
    // Always generate synthetic response for POST in this environment
    return this.generateSyntheticResponse<T, D>(data);
  }

  async put<T, D>(url: string, data: D): Promise<T> {
    // For PUT requests, use the same logic as POST
    return this.post<T, D>(url, data);
  }

  async delete<T>(url: string): Promise<T> {
    await this.simulateNetworkDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error(`Network error: Failed to delete ${url}`);
    }
    
    console.log(`[MOCK] DELETE to ${url}`);
    
    return {
      success: true,
      timestamp: new Date().toISOString()
    } as unknown as T;
  }
}

const mockClient = new MockClient();
export default mockClient;
