/**
 * Database Initialization Script
 * 
 * This script creates sample data for ConceptScroll.
 * Run this once to populate your Supabase database with test data.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');

  try {
    // 1. Create Boards
    console.log('📚 Creating boards...');
    const { data: boards } = await supabase
      .from('boards')
      .upsert([
        { id: '1', name: 'CBSE', description: 'Central Board of Secondary Education', is_active: true },
        { id: '2', name: 'ICSE', description: 'Indian Certificate of Secondary Education', is_active: true },
        { id: '3', name: 'State Board', description: 'State Board', is_active: true },
      ], { onConflict: 'id' })
      .select();

    // 2. Create Classes
    console.log('🎓 Creating classes...');
    const classesData = [];
    for (let i = 1; i <= 12; i++) {
      classesData.push({
        id: `class-${i}`,
        name: `Class ${i}`,
        grade_number: i,
        board_id: '1', // CBSE
        is_active: true,
      });
    }
    await supabase.from('classes').upsert(classesData, { onConflict: 'id' });

    // 3. Create Mediums
    console.log('🌐 Creating mediums...');
    await supabase.from('mediums').upsert([
      { id: 'en', name: 'English', code: 'en', is_active: true },
      { id: 'hi', name: 'Hindi', code: 'hi', is_active: true },
      { id: 'ta', name: 'Tamil', code: 'ta', is_active: true },
      { id: 'te', name: 'Telugu', code: 'te', is_active: true },
      { id: 'mr', name: 'Marathi', code: 'mr', is_active: true },
      { id: 'bn', name: 'Bengali', code: 'bn', is_active: true },
    ], { onConflict: 'id' });

    // 4. Create Subjects for Class 10
    console.log('📖 Creating subjects...');
    const { data: subjects } = await supabase
      .from('subjects')
      .upsert([
        { id: 'physics-10', name: 'Physics', class_id: 'class-10', board_id: '1', is_active: true },
        { id: 'chemistry-10', name: 'Chemistry', class_id: 'class-10', board_id: '1', is_active: true },
        { id: 'math-10', name: 'Mathematics', class_id: 'class-10', board_id: '1', is_active: true },
        { id: 'biology-10', name: 'Biology', class_id: 'class-10', board_id: '1', is_active: true },
        { id: 'english-10', name: 'English', class_id: 'class-10', board_id: '1', is_active: true },
      ], { onConflict: 'id' })
      .select();

    // 5. Create Books
    console.log('📚 Creating books...');
    const { data: books } = await supabase
      .from('books')
      .upsert([
        {
          id: 'physics-10-book',
          title: 'Science - Physics',
          subject_id: 'physics-10',
          class_id: 'class-10',
          medium_id: 'en',
          is_active: true,
        },
        {
          id: 'math-10-book',
          title: 'Mathematics',
          subject_id: 'math-10',
          class_id: 'class-10',
          medium_id: 'en',
          is_active: true,
        },
      ], { onConflict: 'id' })
      .select();

    // 6. Create Chapters
    console.log('📑 Creating chapters...');
    const { data: chapters } = await supabase
      .from('chapters')
      .upsert([
        {
          id: 'chapter-1',
          title: 'Light - Reflection and Refraction',
          chapter_number: 1,
          book_id: 'physics-10-book',
          description: 'Study of light, its reflection and refraction',
          is_active: true,
        },
        {
          id: 'chapter-2',
          title: 'Human Eye and Colorful World',
          chapter_number: 2,
          book_id: 'physics-10-book',
          description: 'Understanding the human eye and perception of color',
          is_active: true,
        },
        {
          id: 'math-chapter-1',
          title: 'Real Numbers',
          chapter_number: 1,
          book_id: 'math-10-book',
          description: 'Introduction to real numbers and their properties',
          is_active: true,
        },
      ], { onConflict: 'id' })
      .select();

    // 7. Create Sample Notes
    console.log('📝 Creating sample notes...');
    const { data: notes } = await supabase
      .from('notes')
      .upsert([
        {
          id: 'note-1',
          title: 'Laws of Reflection',
          content: `The laws of reflection state that:

1. The incident ray, the reflected ray, and the normal to the surface at the point of incidence all lie in the same plane.

2. The angle of incidence is equal to the angle of reflection.

These fundamental laws help us understand how light behaves when it bounces off surfaces. They are crucial for understanding mirrors, both plane and curved.

Key Points to Remember:
• Angle of incidence = Angle of reflection
• Both angles are measured from the normal
• The normal is perpendicular to the reflecting surface
• Regular reflection occurs on smooth surfaces
• Diffuse reflection occurs on rough surfaces`,
          summary: 'Understanding the two fundamental laws that govern how light reflects off surfaces',
          chapter_id: 'chapter-1',
          subject_id: 'physics-10',
          status: 'approved',
        },
        {
          id: 'note-2',
          title: 'Refraction of Light',
          content: `Refraction is the bending of light when it passes from one medium to another.

Why does light bend?
Light travels at different speeds in different media. When light enters a denser medium (like glass from air), it slows down and bends towards the normal. When it enters a rarer medium, it speeds up and bends away from the normal.

Snell's Law:
n₁ sin θ₁ = n₂ sin θ₂

Where:
• n₁, n₂ are refractive indices of the two media
• θ₁ is the angle of incidence
• θ₂ is the angle of refraction

Applications:
• Lenses in spectacles
• Cameras
• Microscopes
• Telescopes`,
          summary: 'Learn about how and why light bends when passing through different media',
          chapter_id: 'chapter-1',
          subject_id: 'physics-10',
          status: 'approved',
        },
        {
          id: 'note-3',
          title: 'Euclid\'s Division Lemma',
          content: `Euclid's Division Lemma is a fundamental result in number theory.

Statement:
Given positive integers a and b, there exist unique integers q and r such that:
a = bq + r, where 0 ≤ r < b

Where:
• a is the dividend
• b is the divisor
• q is the quotient
• r is the remainder

Example:
Let a = 17 and b = 5
17 = 5 × 3 + 2
Here, q = 3 and r = 2

This lemma forms the basis of the Euclidean algorithm for finding the HCF (Highest Common Factor) of two numbers.`,
          summary: 'Understanding Euclid\'s Division Lemma and its applications',
          chapter_id: 'math-chapter-1',
          subject_id: 'math-10',
          status: 'approved',
        },
      ], { onConflict: 'id' })
      .select();

    // 8. Create Sample Quizzes
    console.log('🧠 Creating sample quizzes...');
    const { data: quizzes } = await supabase
      .from('quizzes')
      .upsert([
        {
          id: 'quiz-1',
          title: 'Reflection of Light - Quick Quiz',
          description: 'Test your understanding of reflection concepts',
          chapter_id: 'chapter-1',
          subject_id: 'physics-10',
          duration_minutes: 5,
          passing_score: 60,
          questions: [
            {
              id: 'q1',
              question: 'What is the angle of reflection if the angle of incidence is 30°?',
              options: ['20°', '30°', '45°', '60°'],
              correct_answer: 1,
              difficulty: 'easy',
              explanation: 'According to the law of reflection, angle of incidence equals angle of reflection.',
            },
            {
              id: 'q2',
              question: 'In which type of reflection do all reflected rays remain parallel?',
              options: ['Diffuse reflection', 'Regular reflection', 'Both', 'Neither'],
              correct_answer: 1,
              difficulty: 'medium',
              explanation: 'Regular reflection occurs on smooth surfaces where all reflected rays remain parallel.',
            },
          ],
        },
      ], { onConflict: 'id' })
      .select();

    // 9. Create Sample Polls
    console.log('📊 Creating sample polls...');
    const { data: polls } = await supabase
      .from('polls')
      .upsert([
        {
          id: 'poll-1',
          question: 'Which topic in Physics do you find most interesting?',
          options: [
            { id: 'opt1', text: 'Light and Optics', votes: 45 },
            { id: 'opt2', text: 'Electricity', votes: 67 },
            { id: 'opt3', text: 'Magnetism', votes: 32 },
            { id: 'opt4', text: 'Sound', votes: 28 },
          ],
          chapter_id: 'chapter-1',
          subject_id: 'physics-10',
        },
      ], { onConflict: 'id' })
      .select();

    // 10. Create Content Items (Feed entries)
    console.log('📰 Creating content items for feed...');
    if (notes && quizzes && polls) {
      await supabase.from('content_items').upsert([
        {
          id: 'feed-item-1',
          type: 'note',
          content_id: notes[0].id,
          subject_id: 'physics-10',
          chapter_id: 'chapter-1',
          likes_count: 42,
          comments_count: 8,
          bookmarks_count: 15,
          shares_count: 3,
        },
        {
          id: 'feed-item-2',
          type: 'note',
          content_id: notes[1].id,
          subject_id: 'physics-10',
          chapter_id: 'chapter-1',
          likes_count: 38,
          comments_count: 5,
          bookmarks_count: 12,
          shares_count: 2,
        },
        {
          id: 'feed-item-3',
          type: 'quiz',
          content_id: quizzes[0].id,
          subject_id: 'physics-10',
          chapter_id: 'chapter-1',
          likes_count: 56,
          comments_count: 12,
          bookmarks_count: 23,
          shares_count: 7,
        },
        {
          id: 'feed-item-4',
          type: 'poll',
          content_id: polls[0].id,
          subject_id: 'physics-10',
          chapter_id: 'chapter-1',
          likes_count: 89,
          comments_count: 24,
          bookmarks_count: 18,
          shares_count: 11,
        },
        {
          id: 'feed-item-5',
          type: 'note',
          content_id: notes[2].id,
          subject_id: 'math-10',
          chapter_id: 'math-chapter-1',
          likes_count: 67,
          comments_count: 14,
          bookmarks_count: 29,
          shares_count: 5,
        },
      ], { onConflict: 'id' });
    }

    console.log('✅ Database initialization complete!');
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}
