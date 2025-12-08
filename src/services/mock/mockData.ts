import { ContentItem, UserProfile, Note, Quiz, Poll, QuizQuestion, PollOption } from '../../types';

// Mock Users
export const MOCK_USER: UserProfile = {
  id: 'u1',
  first_name: 'Rahul',
  last_name: 'Sharma',
  email: 'rahul@example.com',
  phone_number: '+919876543210',
  profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
  bio: 'Student at Delhi Public School • Class 10 • Science Enthusiast',
  followers_count: 120,
  following_count: 45,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_AUTHORS = [
  {
    id: 'a1',
    first_name: 'Priya',
    last_name: 'Verma',
    profile_picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    bio: 'Physics Teacher',
    followers_count: 500,
    following_count: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a2',
    first_name: 'Amit',
    last_name: 'Patel',
    profile_picture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    bio: 'Math Wizard',
    followers_count: 350,
    following_count: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a3',
    first_name: 'Rohan',
    last_name: 'Kumar',
    profile_picture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    bio: 'Class 10 Student',
    followers_count: 100,
    following_count: 150,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Mock Stories
export const MOCK_STORIES = [
  {
    id: 's1',
    user_id: 'a1',
    user_name: 'Priya Verma',
    user_avatar: MOCK_AUTHORS[0].profile_picture,
    media_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    is_viewed: false,
  },
  {
    id: 's2',
    user_id: 'a2',
    user_name: 'Amit Patel',
    user_avatar: MOCK_AUTHORS[1].profile_picture,
    media_url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    is_viewed: false,
  },
  {
    id: 's3',
    user_id: 'a3',
    user_name: 'Rohan Kumar',
    user_avatar: MOCK_AUTHORS[2].profile_picture,
    media_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    is_viewed: true,
  }
];

// Mock Books for Library
export interface BookItem {
  id: string;
  title: string;
  author: string;
  subject: string;
  cover_url: string;
  rating: number;
}

export const MOCK_BOOKS: BookItem[] = [
  {
    id: 'b1',
    title: 'Concepts of Physics',
    author: 'H.C. Verma',
    subject: 'Physics',
    cover_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
  },
  {
    id: 'b2',
    title: 'Mathematics for Class 10',
    author: 'R.D. Sharma',
    subject: 'Mathematics',
    cover_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.6,
  },
  {
    id: 'b3',
    title: 'Science NCERT',
    author: 'NCERT',
    subject: 'Science',
    cover_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.5,
  },
  {
    id: 'b4',
    title: 'History of India',
    author: 'Bipin Chandra',
    subject: 'History',
    cover_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
  }
];

export interface ChapterItem {
  id: string;
  book_id: string;
  title: string;
  number: number;
  description: string;
  topics_count: number;
}

export const MOCK_CHAPTERS: ChapterItem[] = [
  // Physics Book (b1)
  { id: 'ch1', book_id: 'b1', title: 'Kinematics', number: 1, description: 'Motion in one dimension, vectors, projectile motion.', topics_count: 5 },
  { id: 'ch2', book_id: 'b1', title: 'Laws of Motion', number: 2, description: 'Newton\'s laws, friction, circular motion.', topics_count: 4 },
  { id: 'ch3', book_id: 'b1', title: 'Work, Energy and Power', number: 3, description: 'Work-energy theorem, conservation of energy.', topics_count: 3 },
  
  // Math Book (b2)
  { id: 'ch4', book_id: 'b2', title: 'Real Numbers', number: 1, description: 'Euclid\'s division lemma, Fundamental Theorem of Arithmetic.', topics_count: 2 },
  { id: 'ch5', book_id: 'b2', title: 'Polynomials', number: 2, description: 'Zeroes of a polynomial, relationship between zeroes and coefficients.', topics_count: 4 },
  
  // Science Book (b3)
  { id: 'ch6', book_id: 'b3', title: 'Chemical Reactions', number: 1, description: 'Types of chemical reactions, balancing equations.', topics_count: 3 },
  { id: 'ch7', book_id: 'b3', title: 'Acids, Bases and Salts', number: 2, description: 'Properties of acids and bases, pH scale.', topics_count: 5 }
];

export interface ChapterContent {
  id: string;
  chapter_id: string;
  title: string;
  type: 'note' | 'video' | 'quiz';
  content: string; // Markdown or description
  duration?: string;
}

export const MOCK_CHAPTER_CONTENT: ChapterContent[] = [
  // Kinematics
  { id: 'cc1', chapter_id: 'ch1', title: 'Introduction to Motion', type: 'note', content: '# Motion\n\nMotion is the change in position of an object with respect to its surroundings in a given interval of time.\n\n## Types of Motion\n1. Rectilinear\n2. Circular\n3. Rotational' },
  { id: 'cc2', chapter_id: 'ch1', title: 'Distance vs Displacement', type: 'video', content: 'Video explanation of vector difference between distance and displacement.', duration: '5:30' },
  { id: 'cc3', chapter_id: 'ch1', title: 'Kinematics Quiz', type: 'quiz', content: 'Test your understanding of basic motion concepts.', duration: '10 mins' },
  
  // Laws of Motion
  { id: 'cc4', chapter_id: 'ch2', title: 'Newton\'s First Law', type: 'note', content: '# Inertia\n\nNewton\'s first law states that every object will remain at rest or in uniform motion in a straight line unless compelled to change its state by the action of an external force.' }
];

// Mock Content Items
export const MOCK_FEED_ITEMS: ContentItem[] = [
  {
    id: 'c1',
    type: 'note',
    content: {
      id: 'n1',
      title: 'Newton\'s Laws of Motion - Quick Summary',
      content: 'Here is a quick revision of Newton\'s three laws of motion:\n\n1. **First Law (Inertia):** An object remains at rest or in uniform motion unless acted upon by a force.\n2. **Second Law (F=ma):** Force equals mass times acceleration.\n3. **Third Law:** For every action, there is an equal and opposite reaction.',
      summary: 'Key concepts of Newton\'s laws for Class 10 Physics.',
      chapter_id: 'ch1',
      subject_id: 'sub1',
      created_by: 'a1',
      status: 'approved',
      media_urls: ['https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      updated_at: new Date().toISOString(),
    } as Note,
    author: MOCK_AUTHORS[0],
    subject: {
      id: 'sub1',
      name: 'Physics',
      class_id: 'cl1',
      board_id: 'b1',
      is_active: true,
    },
    likes_count: 124,
    comments_count: 45,
    bookmarks_count: 12,
    shares_count: 5,
    is_liked: true,
    is_bookmarked: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    type: 'quiz',
    content: {
      id: 'q1',
      title: 'Trigonometry Basics Challenge',
      description: 'Test your knowledge of basic trigonometric ratios. 5 questions, 2 minutes.',
      chapter_id: 'ch2',
      subject_id: 'sub2',
      questions: [
        {
          id: 'qq1',
          question: 'What is sin(30°)?',
          options: ['1/2', '√3/2', '1/√2', '1'],
          correct_answer: 0,
          difficulty: 'easy',
        },
        {
          id: 'qq2',
          question: 'Which of these is an identity?',
          options: ['sin²θ + cos²θ = 1', 'sinθ = cosθ', 'tanθ = 1/cotθ', 'All of the above'],
          correct_answer: 3,
          difficulty: 'medium',
        }
      ] as QuizQuestion[],
      duration_minutes: 2,
      created_at: new Date().toISOString(),
    } as Quiz,
    author: MOCK_AUTHORS[1],
    subject: {
      id: 'sub2',
      name: 'Mathematics',
      class_id: 'cl1',
      board_id: 'b1',
      is_active: true,
    },
    likes_count: 89,
    comments_count: 12,
    bookmarks_count: 34,
    shares_count: 2,
    is_liked: false,
    is_bookmarked: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c3',
    type: 'poll',
    content: {
      id: 'p1',
      question: 'Which topic do you find most difficult in Chemistry?',
      options: [
        { id: 'po1', text: 'Organic Chemistry', votes: 150, percentage: 45 },
        { id: 'po2', text: 'Periodic Table', votes: 80, percentage: 24 },
        { id: 'po3', text: 'Chemical Bonding', votes: 60, percentage: 18 },
        { id: 'po4', text: 'Mole Concept', votes: 45, percentage: 13 },
      ] as PollOption[],
      created_by: 'a1',
      created_at: new Date().toISOString(),
    } as Poll,
    author: MOCK_AUTHORS[0],
    subject: {
      id: 'sub3',
      name: 'Chemistry',
      class_id: 'cl1',
      board_id: 'b1',
      is_active: true,
    },
    likes_count: 56,
    comments_count: 120,
    bookmarks_count: 5,
    shares_count: 1,
    is_liked: false,
    is_bookmarked: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c4',
    type: 'note',
    content: {
      id: 'n2',
      title: 'History: The Rise of Nationalism in Europe',
      content: 'The French Revolution and the Idea of the Nation:\n\n- The first clear expression of nationalism came with the French Revolution in 1789.\n- The political and constitutional changes that came in the wake of the French Revolution led to the transfer of sovereignty from the monarchy to a body of French citizens.',
      summary: 'Important points for Board Exams.',
      chapter_id: 'ch3',
      subject_id: 'sub4',
      created_by: 'a2',
      status: 'approved',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      updated_at: new Date().toISOString(),
    } as Note,
    author: MOCK_AUTHORS[1],
    subject: {
      id: 'sub4',
      name: 'History',
      class_id: 'cl1',
      board_id: 'b1',
      is_active: true,
    },
    likes_count: 210,
    comments_count: 67,
    bookmarks_count: 88,
    shares_count: 23,
    is_liked: true,
    is_bookmarked: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updated_at: new Date().toISOString(),
  }
];
