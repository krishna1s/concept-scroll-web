-- ====================================================================
-- CONCEPTSCROLL - SEED DATA FOR TESTING
-- ====================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Click "Run" to populate your database with sample data
-- ====================================================================

-- Clear existing data (to avoid duplicates)
DELETE FROM chapters;
DELETE FROM books;
DELETE FROM subjects;
DELETE FROM mediums;
DELETE FROM classes;
DELETE FROM boards;

-- ====================================================================
-- 1. BOARDS
-- ====================================================================
INSERT INTO boards (id, name, code, description, logo_url, is_active) VALUES
('b1111111-1111-1111-1111-111111111111', 'CBSE', 'CBSE', 'Central Board of Secondary Education', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop', true),
('b2222222-2222-2222-2222-222222222222', 'ICSE', 'ICSE', 'Indian Certificate of Secondary Education', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&h=100&fit=crop', true),
('b3333333-3333-3333-3333-333333333333', 'State Board (UP)', 'UP_BOARD', 'Uttar Pradesh Board of High School and Intermediate Education', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&h=100&fit=crop', true),
('b4444444-4444-4444-4444-444444444444', 'State Board (Maharashtra)', 'MH_BOARD', 'Maharashtra State Board of Secondary and Higher Secondary Education', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop', true);

-- ====================================================================
-- 2. CLASSES (Grades)
-- ====================================================================
-- CBSE Classes
INSERT INTO classes (id, name, grade_number, board_id, description, logo_url, is_active) VALUES
('c0801111-1111-1111-1111-111111111111', 'Class 8', 8, 'b1111111-1111-1111-1111-111111111111', 'CBSE Class 8', NULL, true),
('c0901111-1111-1111-1111-111111111111', 'Class 9', 9, 'b1111111-1111-1111-1111-111111111111', 'CBSE Class 9', NULL, true),
('c1001111-1111-1111-1111-111111111111', 'Class 10', 10, 'b1111111-1111-1111-1111-111111111111', 'CBSE Class 10 (Secondary)', NULL, true),
('c1101111-1111-1111-1111-111111111111', 'Class 11', 11, 'b1111111-1111-1111-1111-111111111111', 'CBSE Class 11 (Higher Secondary)', NULL, true),
('c1201111-1111-1111-1111-111111111111', 'Class 12', 12, 'b1111111-1111-1111-1111-111111111111', 'CBSE Class 12 (Senior Secondary)', NULL, true);

-- ICSE Classes
INSERT INTO classes (id, name, grade_number, board_id, description, logo_url, is_active) VALUES
('c1002222-2222-2222-2222-222222222222', 'Class 10', 10, 'b2222222-2222-2222-2222-222222222222', 'ICSE Class 10', NULL, true),
('c1202222-2222-2222-2222-222222222222', 'Class 12', 12, 'b2222222-2222-2222-2222-222222222222', 'ISC Class 12', NULL, true);

-- ====================================================================
-- 3. MEDIUMS
-- ====================================================================
INSERT INTO mediums (id, name, code, is_active) VALUES
('m1111111-1111-1111-1111-111111111111', 'English', 'en', true),
('m2222222-2222-2222-2222-222222222222', 'Hindi', 'hi', true),
('m3333333-3333-3333-3333-333333333333', 'Marathi', 'mr', true),
('m4444444-4444-4444-4444-444444444444', 'Tamil', 'ta', true),
('m5555555-5555-5555-5555-555555555555', 'Telugu', 'te', true),
('m6666666-6666-6666-6666-666666666666', 'Bengali', 'bn', true);

-- ====================================================================
-- 4. SUBJECTS (For CBSE Class 10)
-- ====================================================================
INSERT INTO subjects (id, name, description, class_id, icon_url, color_code, is_active) VALUES
('s1001111-1111-1111-1111-111111111111', 'Mathematics', 'Standard Mathematics for Class 10', 'c1001111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&h=100&fit=crop', '#3B82F6', true),
('s2001111-1111-1111-1111-111111111111', 'Science', 'Physics, Chemistry, Biology', 'c1001111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&h=100&fit=crop', '#10B981', true),
('s3001111-1111-1111-1111-111111111111', 'Social Science', 'History, Geography, Civics, Economics', 'c1001111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop', '#F59E0B', true),
('s4001111-1111-1111-1111-111111111111', 'English', 'English Language and Literature', 'c1001111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&h=100&fit=crop', '#8B5CF6', true),
('s5001111-1111-1111-1111-111111111111', 'Hindi', 'Hindi Course A', 'c1001111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=100&h=100&fit=crop', '#EF4444', true);

-- Subjects for Class 9
INSERT INTO subjects (id, name, description, class_id, icon_url, color_code, is_active) VALUES
('s1000911-1111-1111-1111-111111111111', 'Mathematics', 'Mathematics for Class 9', 'c0901111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&h=100&fit=crop', '#3B82F6', true),
('s2000911-1111-1111-1111-111111111111', 'Science', 'Physics, Chemistry, Biology', 'c0901111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&h=100&fit=crop', '#10B981', true),
('s3000911-1111-1111-1111-111111111111', 'Social Science', 'History, Geography, Civics, Economics', 'c0901111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop', '#F59E0B', true),
('s4000911-1111-1111-1111-111111111111', 'English', 'English Language and Literature', 'c0901111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&h=100&fit=crop', '#8B5CF6', true),
('s5000911-1111-1111-1111-111111111111', 'Hindi', 'Hindi Course A', 'c0901111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=100&h=100&fit=crop', '#EF4444', true);

-- Subjects for Class 12 (Science Stream)
INSERT INTO subjects (id, name, description, class_id, icon_url, color_code, is_active) VALUES
('s1001211-1111-1111-1111-111111111111', 'Physics', 'Physics for Class 12', 'c1201111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=100&h=100&fit=crop', '#3B82F6', true),
('s2001211-1111-1111-1111-111111111111', 'Chemistry', 'Chemistry for Class 12', 'c1201111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=100&h=100&fit=crop', '#10B981', true),
('s3001211-1111-1111-1111-111111111111', 'Mathematics', 'Mathematics for Class 12', 'c1201111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&h=100&fit=crop', '#F59E0B', true),
('s4001211-1111-1111-1111-111111111111', 'Biology', 'Biology for Class 12', 'c1201111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?w=100&h=100&fit=crop', '#22C55E', true),
('s5001211-1111-1111-1111-111111111111', 'English', 'English Core', 'c1201111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&h=100&fit=crop', '#8B5CF6', true);

-- ====================================================================
-- 5. BOOKS (For CBSE Class 10 Mathematics)
-- ====================================================================
INSERT INTO books (id, title, description, class_id, subject_id, medium_id, author, publisher, edition, cover_image_url, is_active) VALUES
('bk101111-1111-1111-1111-111111111111', 
 'NCERT Mathematics - Class 10', 
 'Official NCERT textbook for Class 10 Mathematics', 
 'c1001111-1111-1111-1111-111111111111', 
 's1001111-1111-1111-1111-111111111111', 
 'm1111111-1111-1111-1111-111111111111',
 'NCERT',
 'NCERT',
 '2024',
 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=400&fit=crop',
 true);

-- Science Book
INSERT INTO books (id, title, description, class_id, subject_id, medium_id, author, publisher, edition, cover_image_url, is_active) VALUES
('bk201111-1111-1111-1111-111111111111', 
 'NCERT Science - Class 10', 
 'Official NCERT textbook for Class 10 Science', 
 'c1001111-1111-1111-1111-111111111111', 
 's2001111-1111-1111-1111-111111111111', 
 'm1111111-1111-1111-1111-111111111111',
 'NCERT',
 'NCERT',
 '2024',
 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=400&fit=crop',
 true);

-- Social Science Book
INSERT INTO books (id, title, description, class_id, subject_id, medium_id, author, publisher, edition, cover_image_url, is_active) VALUES
('bk301111-1111-1111-1111-111111111111', 
 'NCERT Social Science - Class 10', 
 'Official NCERT textbook for Class 10 Social Science', 
 'c1001111-1111-1111-1111-111111111111', 
 's3001111-1111-1111-1111-111111111111', 
 'm1111111-1111-1111-1111-111111111111',
 'NCERT',
 'NCERT',
 '2024',
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=400&fit=crop',
 true);

-- ====================================================================
-- 6. CHAPTERS (For Mathematics Class 10)
-- ====================================================================
INSERT INTO chapters (id, book_id, chapter_number, title, description, is_active) VALUES
('ch011111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 1, 'Real Numbers', 'Introduction to real numbers, Euclid''s division lemma, and fundamental theorem of arithmetic', true),
('ch021111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 2, 'Polynomials', 'Polynomials, zeros of polynomials, and relationship between zeros and coefficients', true),
('ch031111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 3, 'Pair of Linear Equations in Two Variables', 'Linear equations, graphical and algebraic methods of solving', true),
('ch041111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 4, 'Quadratic Equations', 'Standard form, solutions by factorization, and quadratic formula', true),
('ch051111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 5, 'Arithmetic Progressions', 'AP, nth term, and sum of n terms', true),
('ch061111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 6, 'Triangles', 'Similar triangles, criteria for similarity, and Pythagoras theorem', true),
('ch071111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 7, 'Coordinate Geometry', 'Distance formula, section formula, and area of triangle', true),
('ch081111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 8, 'Introduction to Trigonometry', 'Trigonometric ratios, identities, and complementary angles', true),
('ch091111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 9, 'Applications of Trigonometry', 'Heights and distances using trigonometry', true),
('ch101111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 10, 'Circles', 'Tangent to a circle and number of tangents from a point', true),
('ch111111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 11, 'Areas Related to Circles', 'Perimeter and area of circle, areas of sector and segment', true),
('ch121111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 12, 'Surface Areas and Volumes', 'Surface areas and volumes of combinations of solids', true),
('ch131111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 13, 'Statistics', 'Mean, median, mode of grouped data, and cumulative frequency graph', true),
('ch141111-1111-1111-1111-111111111111', 'bk101111-1111-1111-1111-111111111111', 14, 'Probability', 'Classical definition of probability and simple problems', true);

-- Chapters for Science
INSERT INTO chapters (id, book_id, chapter_number, title, description, is_active) VALUES
('ch012111-1111-1111-1111-111111111111', 'bk201111-1111-1111-1111-111111111111', 1, 'Chemical Reactions and Equations', 'Types of chemical reactions and balancing equations', true),
('ch022111-1111-1111-1111-111111111111', 'bk201111-1111-1111-1111-111111111111', 2, 'Acids, Bases and Salts', 'Properties of acids and bases, pH scale', true),
('ch032111-1111-1111-1111-111111111111', 'bk201111-1111-1111-1111-111111111111', 3, 'Metals and Non-metals', 'Properties and chemical reactions', true),
('ch042111-1111-1111-1111-111111111111', 'bk201111-1111-1111-1111-111111111111', 4, 'Carbon and its Compounds', 'Bonding in carbon compounds', true),
('ch052111-1111-1111-1111-111111111111', 'bk201111-1111-1111-1111-111111111111', 5, 'Life Processes', 'Nutrition, respiration, transportation, excretion', true),
('ch062111-1111-1111-1111-111111111111', 'bk201111-1111-1111-1111-111111111111', 6, 'Control and Coordination', 'Nervous system and hormones', true),
('ch072111-1111-1111-1111-111111111111', 'bk201111-1111-1111-1111-111111111111', 7, 'Light - Reflection and Refraction', 'Laws of reflection and refraction', true),
('ch082111-1111-1111-1111-111111111111', 'bk201111-1111-1111-1111-111111111111', 8, 'Electricity', 'Electric current, potential difference, Ohm''s law', true);

-- Chapters for Social Science
INSERT INTO chapters (id, book_id, chapter_number, title, description, is_active) VALUES
('ch013111-1111-1111-1111-111111111111', 'bk301111-1111-1111-1111-111111111111', 1, 'The Rise of Nationalism in Europe', 'History: Nationalism in 19th century Europe', true),
('ch023111-1111-1111-1111-111111111111', 'bk301111-1111-1111-1111-111111111111', 2, 'Nationalism in India', 'History: Indian independence movement', true),
('ch033111-1111-1111-1111-111111111111', 'bk301111-1111-1111-1111-111111111111', 3, 'Resources and Development', 'Geography: Types and conservation of resources', true),
('ch043111-1111-1111-1111-111111111111', 'bk301111-1111-1111-1111-111111111111', 4, 'Forest and Wildlife Resources', 'Geography: Conservation of biodiversity', true),
('ch053111-1111-1111-1111-111111111111', 'bk301111-1111-1111-1111-111111111111', 5, 'Power Sharing', 'Civics: Forms of power sharing', true),
('ch063111-1111-1111-1111-111111111111', 'bk301111-1111-1111-1111-111111111111', 6, 'Federalism', 'Civics: Federal system in India', true),
('ch073111-1111-1111-1111-111111111111', 'bk301111-1111-1111-1111-111111111111', 7, 'Development', 'Economics: Measuring development', true),
('ch083111-1111-1111-1111-111111111111', 'bk301111-1111-1111-1111-111111111111', 8, 'Sectors of Indian Economy', 'Economics: Primary, secondary, tertiary sectors', true);

-- ====================================================================
-- SUCCESS!
-- ====================================================================
-- Your database is now populated with:
-- ✅ 4 Boards (CBSE, ICSE, State Boards)
-- ✅ 7 Classes (8, 9, 10, 11, 12)
-- ✅ 6 Mediums (English, Hindi, Marathi, Tamil, Telugu, Bengali)
-- ✅ 15 Subjects (Math, Science, Social Science, etc.)
-- ✅ 3 Books (NCERT textbooks)
-- ✅ 30 Chapters (across all books)
-- ====================================================================