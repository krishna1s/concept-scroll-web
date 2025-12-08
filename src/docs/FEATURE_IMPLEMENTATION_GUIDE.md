# Feature Implementation & API Guide

This document outlines the API requirements, data models, and implementation strategies for the new features: Leaderboard, Daily Streak, Peer Following, Daily Goals, Library, and Stories.

## 1. Daily Streak & Progress Tracking

### Concept
The daily streak tracks consecutive days a user has completed a learning activity (quiz, reading notes, etc.).

### Logic
- **Increment:** When a user completes an activity, the backend checks if `last_activity_date` was yesterday. If so, `streak_count += 1`. If today, do nothing. If earlier than yesterday, `streak_count = 1`.
- **Display:** Show flame icon with count on Dashboard and Profile.

### API Endpoints
**GET /api/user/progress/**
Returns current streak, XP, and level.
```json
{
  "streak": 5,
  "xp": 1250,
  "level": 12,
  "next_level_xp": 1500,
  "daily_goal_progress": {
    "target": 3,
    "completed": 1
  }
}
```

**POST /api/user/activity/**
Log an activity to update streak.
```json
{
  "activity_type": "quiz_completion", // or 'note_read', 'daily_login'
  "reference_id": "quiz_123"
}
```

---

## 2. Peer Following

### Concept
Students can follow peers or teachers to see their activity in a "Following" feed or Leaderboard.

### API Endpoints
**POST /api/social/follow/**
```json
{
  "user_id": "u_456"
}
```

**DELETE /api/social/unfollow/{user_id}/**

**GET /api/social/followers/**
**GET /api/social/following/**

---

## 3. Leaderboard (XP Based)

### Concept
Rank users based on XP gained within a timeframe (Weekly, All-time).

### API Endpoints
**GET /api/leaderboard/**
Parameters: `type=global|school|subject`, `timeframe=weekly|all_time`
```json
{
  "rank": 4,
  "leaders": [
    { "user_id": "u1", "name": "Priya", "xp": 2000, "avatar": "..." },
    ...
  ]
}
```

---

## 4. Daily Goals

### Concept
Users set a daily goal (e.g., "Complete 3 Quizzes", "Study 30 mins").

### API Endpoints
**GET /api/goals/daily/**
**POST /api/goals/set/**
```json
{
  "goal_type": "quiz_count",
  "target_value": 3
}
```

---

## 5. Library & Book Search

### Concept
A central place to find books, notes, and resources across subjects.

### API Endpoints
**GET /api/library/books/**
Parameters: `search=physics`, `class=10`, `subject=science`
```json
{
  "items": [
    { "id": "b1", "title": "HC Verma Physics", "subject": "Physics", "cover_url": "..." }
  ]
}
```

---

## 6. Stories (Feed)

### Concept
Short ephemeral content (images/text) at the top of the feed, similar to Instagram Stories.

### API Endpoints
**GET /api/feed/stories/**
```json
[
  {
    "id": "s1",
    "user": { "name": "Amit", "avatar": "..." },
    "image_url": "...",
    "viewed": false
  }
]
```

---

## Mock Client Implementation plan
1. Update `mockData.ts` with mock objects for Stories, Books, and extended User profiles.
2. Implement new components consuming this data.
