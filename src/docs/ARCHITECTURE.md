# Architecture Overview

## Design Principles

ConceptScroll is built on three core architectural principles:

### 1. **Backend Decoupling**
The frontend never directly imports or uses Supabase (or any specific backend). All backend calls go through the `IApiClient` interface.

```typescript
// ✅ Good - Uses abstraction
import { apiClient } from './services/api';
const feed = await apiClient.getHomeFeed(1, 10);

// ❌ Bad - Direct backend coupling
import { supabase } from './supabase';
const { data } = await supabase.from('content_items').select();
```

### 2. **Type Safety**
All types are defined once in `/types/index.ts` and match the backend schema exactly. This ensures compile-time safety and autocomplete across the entire app.

### 3. **Feature Modularity**
Each feature (auth, feed, library) has its own:
- Types (in `/types/index.ts`)
- API contract methods (in `/services/api/contract.ts`)
- Strings (in `/strings/*.ts`)
- Components (in `/components/*`)

## Architecture Layers

```
┌─────────────────────────────────────┐
│         UI Components               │
│  (React + Tailwind + Localization)  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│       IApiClient Interface          │
│   (Backend-agnostic contract)       │
└────────────────┬────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
┌─────▼────────┐    ┌──────▼────────┐
│  Supabase    │    │   Django      │
│   Adapter    │    │   Adapter     │
│  (Current)   │    │  (Future)     │
└──────────────┘    └───────────────┘
```

## Data Flow

### 1. User Action → API Call → UI Update

```typescript
// Component
import { apiClient } from '../services/api';
import { useLocalization } from '../services/localization/LocalizationProvider';

function FeedComponent() {
  const { strings } = useLocalization();
  
  const handleLike = async (contentId: string) => {
    try {
      await apiClient.likeContent(contentId);
      // Update UI
      toast.success(strings.feed.liked);
    } catch (error) {
      toast.error('Error liking content');
    }
  };
  
  return <button onClick={() => handleLike('123')}>{strings.feed.like}</button>;
}
```

### 2. API Contract → Backend Implementation

```typescript
// contract.ts - Defines what the app needs
interface IApiClient {
  likeContent(contentItemId: string): Promise<Like>;
}

// supabaseClient.ts - Implements using Supabase
class SupabaseApiClient implements IApiClient {
  async likeContent(contentItemId: string): Promise<Like> {
    const { data } = await this.supabase
      .from('likes')
      .insert({ content_item_id: contentItemId, user_id: userId });
    return data;
  }
}

// djangoClient.ts - Future implementation using Django
class DjangoApiClient implements IApiClient {
  async likeContent(contentItemId: string): Promise<Like> {
    const response = await fetch(`${this.baseUrl}/api/feed/content-items/${contentItemId}/like/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }
}
```

## State Management

The app uses **React Context** for global state:

1. **AuthContext**: User session and profile
2. **ThemeContext**: Theme mode and colors
3. **LocalizationContext**: Current locale and strings

For server state, we use component-level state with API calls. For complex features, you can add:
- React Query (for caching and optimistic updates)
- Zustand (for client state management)

## Folder Structure Philosophy

### `/types/`
Single source of truth for all data models. Types match the backend schema exactly.

### `/services/api/`
- `contract.ts`: Defines WHAT the app needs from backend
- `supabaseClient.ts`: Implements HOW using Supabase
- `djangoClient.ts`: (Future) Implements HOW using Django
- `index.ts`: Factory that provides the current implementation

### `/strings/`
Organized by feature for easy maintenance:
- `common.ts`: Shared strings (Save, Cancel, Delete, etc.)
- `auth.ts`: Login, signup, OTP strings
- `feed.ts`: Feed-specific strings
- `library.ts`: Library-specific strings

### `/components/`
Feature-based component organization:
```
components/
├── auth/
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── feed/
│   ├── FeedCard.tsx
│   ├── FeedFilters.tsx
│   └── CommentSection.tsx
├── library/
│   ├── BookCard.tsx
│   └── ChapterList.tsx
└── common/
    ├── Button.tsx
    └── Modal.tsx
```

## Backend Schema Alignment

The app is designed to work with this hierarchy:

```
Board (CBSE, ICSE, State Boards)
  ↓
Class (1-12)
  ↓
Medium (English, Hindi, Tamil, etc.)
  ↓
Subject (Physics, Chemistry, Math, etc.)
  ↓
Book (Textbook for that subject)
  ↓
Chapter (Individual chapters)
  ↓
Content (Notes, Quizzes, QA, Polls)
```

This matches your Django backend's structure exactly.

## Migration Strategy

When migrating to Django backend:

1. **Phase 1**: Keep Supabase running, create Django adapter
2. **Phase 2**: Test Django adapter in parallel
3. **Phase 3**: Switch factory to use Django adapter
4. **Phase 4**: Deprecate Supabase

The frontend code doesn't change at all during migration!

## Performance Considerations

1. **Pagination**: All list endpoints support pagination
2. **Lazy Loading**: Content loads as user scrolls
3. **Image Optimization**: Use thumbnail URLs for feed
4. **Caching**: Consider adding React Query for automatic caching

## Security

1. **Row Level Security**: Supabase RLS protects user data
2. **JWT Tokens**: Secure authentication
3. **API Key Protection**: Never expose service role keys to frontend
4. **Input Validation**: All inputs validated before API calls

## Testing Strategy

1. **Type Safety**: TypeScript catches errors at compile time
2. **API Contract**: Mock `IApiClient` for component testing
3. **Integration Tests**: Test with real Supabase instance
4. **E2E Tests**: Test critical user flows

## Scalability

The architecture supports:
- **Horizontal Scaling**: Stateless API layer
- **Multiple Backends**: Can use different backends per region
- **Feature Flags**: Easy to toggle features
- **A/B Testing**: Different implementations of IApiClient for different user groups
