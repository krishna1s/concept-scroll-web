# Backend Migration Guide

This guide explains how to migrate from Supabase to your Django REST backend.

## Why This Architecture Makes Migration Easy

The frontend uses an abstract `IApiClient` interface, which means:
- Frontend code never directly imports Supabase
- All API calls go through a single contract
- Swapping backends requires changing only ONE file

## Migration Steps

### Step 1: Create Django API Client

Create `/services/api/djangoClient.ts`:

```typescript
import { IApiClient } from './contract';
import {
  User,
  AuthTokens,
  ContentItem,
  // ... import all types
} from '../../types';

export class DjangoApiClient implements IApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl; // e.g., 'https://api.conceptscroll.com'
  }

  // ==================== Authentication ====================
  
  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await fetch(`${this.baseUrl}/api/users/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });
    
    if (!response.ok) throw new Error('Login failed');
    
    const data = await response.json();
    this.token = data.data.access_token;
    return data.data;
  }

  async requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/api/users/auth/request_otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    
    const data = await response.json();
    return { success: data.success, message: data.message };
  }

  async verifyOTP(phoneNumber: string, otpCode: string): Promise<AuthTokens> {
    const response = await fetch(`${this.baseUrl}/api/users/auth/verify_otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, otp_code: otpCode }),
    });
    
    const data = await response.json();
    this.token = data.data.access_token;
    return data.data;
  }

  // ==================== Feed System ====================
  
  async getHomeFeed(page: number, size: number): Promise<PaginatedResponse<ContentItem>> {
    const response = await fetch(
      `${this.baseUrl}/api/feed/content-items/feed/home/?page=${page}&size=${size}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      }
    );
    
    const data = await response.json();
    return {
      items: data.data.results,
      total: data.data.count,
      page,
      size,
      has_more: !!data.data.next,
    };
  }

  async getExploreFeed(
    page: number,
    size: number,
    filters?: FeedFilters
  ): Promise<PaginatedResponse<ContentItem>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (filters?.subjects) params.append('subjects', filters.subjects.join(','));
    if (filters?.types) params.append('types', filters.types.join(','));
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    
    const response = await fetch(
      `${this.baseUrl}/api/feed/content-items/feed/explore/?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      }
    );
    
    const data = await response.json();
    return {
      items: data.data.results,
      total: data.data.count,
      page,
      size,
      has_more: !!data.data.next,
    };
  }

  async likeContent(contentItemId: string): Promise<Like> {
    const response = await fetch(
      `${this.baseUrl}/api/feed/content-items/${contentItemId}/like/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      }
    );
    
    const data = await response.json();
    return data.data;
  }

  // ... implement all other methods from IApiClient interface
}
```

### Step 2: Update API Factory

Update `/services/api/index.ts`:

```typescript
import { IApiClient } from './contract';
// import { SupabaseApiClient } from './supabaseClient';
import { DjangoApiClient } from './djangoClient';

// Switch from Supabase to Django
export const apiClient: IApiClient = new DjangoApiClient('https://api.conceptscroll.com');

// Old Supabase code (commented out):
// const supabaseUrl = `https://${projectId}.supabase.co`;
// export const apiClient: IApiClient = new SupabaseApiClient(supabaseUrl, publicAnonKey);
```

### Step 3: Test the Migration

That's it! Your entire frontend now uses Django backend. No component code changes needed.

## Response Format Mapping

Your Django backend uses this response format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "errors": [],
  "code": 200
}
```

In your Django client, unwrap the `data` field:

```typescript
const response = await fetch(url);
const json = await response.json();

// Django wraps data in { data: {...} }
return json.data;
```

## Pagination Mapping

Django uses:
```json
{
  "count": 100,
  "next": "http://...",
  "previous": "http://...",
  "results": [...]
}
```

Map to our `PaginatedResponse`:

```typescript
return {
  items: data.data.results,
  total: data.data.count,
  page,
  size,
  has_more: !!data.data.next,
};
```

## Error Handling

Django errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "This field is required." }
  ],
  "code": 400
}
```

Handle in Django client:

```typescript
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message || 'API Error');
}
```

## Authentication Token Management

Store JWT token in `DjangoApiClient`:

```typescript
class DjangoApiClient implements IApiClient {
  private token: string | null = null;

  async login(email: string, password: string): Promise<AuthTokens> {
    const data = await this.post('/api/users/auth/login/', { email, password });
    this.token = data.access_token;
    
    // Persist token
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    
    return data;
  }

  async getSession() {
    this.token = localStorage.getItem('access_token');
    
    if (!this.token) {
      return { user: null, accessToken: null };
    }
    
    // Verify token is still valid
    try {
      const profile = await this.getProfile();
      return { user: profile, accessToken: this.token };
    } catch {
      return { user: null, accessToken: null };
    }
  }

  private async post(url: string, body: any) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) throw new Error('API Error');
    
    const data = await response.json();
    return data.data; // Unwrap Django response
  }
}
```

## Field Mapping

If your Django backend uses different field names, map them in the adapter:

```typescript
// Django returns snake_case, frontend uses camelCase
async getProfile(): Promise<UserProfile> {
  const data = await this.get('/api/users/profile/');
  
  return {
    id: data.id,
    firstName: data.first_name,  // Map snake_case → camelCase
    lastName: data.last_name,
    profilePicture: data.profile_picture,
    followersCount: data.followers_count,
    followingCount: data.following_count,
    // ... etc
  };
}
```

## Parallel Running (Recommended)

During migration, run both backends in parallel:

```typescript
// services/api/index.ts
const USE_DJANGO = process.env.REACT_APP_USE_DJANGO === 'true';

export const apiClient: IApiClient = USE_DJANGO
  ? new DjangoApiClient('https://api.conceptscroll.com')
  : new SupabaseApiClient(supabaseUrl, supabaseKey);
```

This allows:
- A/B testing between backends
- Gradual user migration
- Rollback if issues occur

## Data Migration

If migrating existing users from Supabase to Django:

1. **Export Supabase data**:
   ```typescript
   // Export script
   const { data: users } = await supabase.from('user_profiles').select('*');
   const { data: content } = await supabase.from('content_items').select('*');
   // ... export all tables
   ```

2. **Import to Django**:
   ```python
   # Django management command
   for user_data in users:
       User.objects.create(**user_data)
   ```

3. **Map IDs**: Keep a mapping table if IDs change

## Checklist

Before switching to Django:

- [ ] All `IApiClient` methods implemented in `DjangoApiClient`
- [ ] Authentication flow tested (login, signup, OTP)
- [ ] Feed endpoints tested (home, explore, bookmarks)
- [ ] Social features tested (like, comment, follow)
- [ ] Error handling implemented
- [ ] Token refresh implemented (if using JWT)
- [ ] CORS configured on Django backend
- [ ] Production URL configured
- [ ] SSL certificates in place

## Rollback Plan

If issues occur:

```typescript
// Instant rollback - change one line
export const apiClient: IApiClient = new SupabaseApiClient(supabaseUrl, supabaseKey);
```

No other code changes needed!

## Performance Optimization

For Django backend:

1. **Request Batching**: Create a `batchRequest` method:
   ```typescript
   async batchRequest(requests: Array<() => Promise<any>>) {
     return Promise.all(requests.map(req => req()));
   }
   ```

2. **Caching**: Add React Query:
   ```typescript
   import { useQuery } from 'react-query';
   
   function useFeed(page: number) {
     return useQuery(['feed', page], () => apiClient.getHomeFeed(page, 10));
   }
   ```

3. **Prefetching**: Preload next page while user scrolls

## Success Criteria

Migration is successful when:
- All features work identically
- Response times are comparable or better
- No errors in console
- User experience is unchanged
- Data is consistent

## Support

For migration issues:
1. Check `/docs/API_CONTRACT.md` for endpoint specifications
2. Compare Django Swagger docs with `IApiClient` interface
3. Verify response format matches expected types
4. Test with Postman/Insomnia before implementing
