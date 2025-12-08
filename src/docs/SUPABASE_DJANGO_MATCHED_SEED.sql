-- ====================================================================
-- ConceptScroll - Seed Data (DJANGO-MATCHED)
-- ====================================================================
-- Run this AFTER running SUPABASE_DJANGO_MATCHED_SCHEMA.sql
-- This populates tables with sample Indian curriculum data
-- ====================================================================

-- ====================================================================
-- 1. BOARDS
-- ====================================================================

INSERT INTO boards (id, name, code, description, is_active) VALUES
('10000000-0000-0000-0000-000000000001', 'CBSE', 'CBSE', 'Central Board of Secondary Education', true),
('10000000-0000-0000-0000-000000000002', 'ICSE', 'ICSE', 'Indian Certificate of Secondary Education', true),
('10000000-0000-0000-0000-000000000003', 'Maharashtra State Board', 'MSBSHSE', 'Maharashtra State Board', true),
('10000000-0000-0000-0000-000000000004', 'Tamil Nadu State Board', 'TNBSE', 'Tamil Nadu State Board', true)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 2. MEDIUMS
-- ====================================================================

INSERT INTO mediums (id, name, code, is_active) VALUES
('20000000-0000-0000-0000-000000000001', 'English', 'en', true),
('20000000-0000-0000-0000-000000000002', 'Hindi', 'hi', true),
('20000000-0000-0000-0000-000000000003', 'Tamil', 'ta', true),
('20000000-0000-0000-0000-000000000004', 'Telugu', 'te', true),
('20000000-0000-0000-0000-000000000005', 'Marathi', 'mr', true),
('20000000-0000-0000-0000-000000000006', 'Bengali', 'bn', true)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 3. CLASSES (Grade 9-12 for CBSE, 9-10 for ICSE)
-- ====================================================================

INSERT INTO classes (id, name, grade_number, board_id, is_active) VALUES
-- CBSE Classes
('30000000-0000-0000-0000-000000000001', 'Class 9', 9, '10000000-0000-0000-0000-000000000001', true),
('30000000-0000-0000-0000-000000000002', 'Class 10', 10, '10000000-0000-0000-0000-000000000001', true),
('30000000-0000-0000-0000-000000000003', 'Class 11', 11, '10000000-0000-0000-0000-000000000001', true),
('30000000-0000-0000-0000-000000000004', 'Class 12', 12, '10000000-0000-0000-0000-000000000001', true),
-- ICSE Classes
('30000000-0000-0000-0000-000000000011', 'Class 9', 9, '10000000-0000-0000-0000-000000000002', true),
('30000000-0000-0000-0000-000000000012', 'Class 10', 10, '10000000-0000-0000-0000-000000000002', true)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 4. SUBJECTS (for Class 10 CBSE)
-- ====================================================================

INSERT INTO subjects (id, name, description, class_id, color_code, is_active) VALUES
('40000000-0000-0000-0000-000000000001', 'Mathematics', 'Class 10 Mathematics', '30000000-0000-0000-0000-000000000002', '#FF6B6B', true),
('40000000-0000-0000-0000-000000000002', 'Science', 'Class 10 Science', '30000000-0000-0000-0000-000000000002', '#4ECDC4', true),
('40000000-0000-0000-0000-000000000003', 'English', 'Class 10 English', '30000000-0000-0000-0000-000000000002', '#95E1D3', true),
('40000000-0000-0000-0000-000000000004', 'Social Science', 'Class 10 Social Science', '30000000-0000-0000-0000-000000000002', '#F38181', true),
('40000000-0000-0000-0000-000000000005', 'Hindi', 'Class 10 Hindi', '30000000-0000-0000-0000-000000000002', '#AA96DA', true)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 5. BOOKS (for Mathematics & Science Class 10)
-- ====================================================================

INSERT INTO books (id, name, description, subject_id, medium_id, is_active) VALUES
('50000000-0000-0000-0000-000000000001', 
 'Mathematics Textbook for Class 10', 
 'NCERT Mathematics textbook covering all chapters for Class 10', 
 '40000000-0000-0000-0000-000000000001', 
 '20000000-0000-0000-0000-000000000001', 
 true),
('50000000-0000-0000-0000-000000000002', 
 'Science Textbook for Class 10', 
 'NCERT Science textbook covering Physics, Chemistry, and Biology', 
 '40000000-0000-0000-0000-000000000002', 
 '20000000-0000-0000-0000-000000000001', 
 true)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 6. CHAPTERS (Mathematics Class 10)
-- ====================================================================

INSERT INTO chapters (id, name, number, description, book_id, is_active, display_name) VALUES
('60000000-0000-0000-0000-000000000001', 'Real Numbers', 1, 'Introduction to real numbers, Euclid''s division algorithm, HCF, and LCM', '50000000-0000-0000-0000-000000000001', true, 'Ch 1: Real Numbers'),
('60000000-0000-0000-0000-000000000002', 'Polynomials', 2, 'Polynomials and their types, zeros of polynomials', '50000000-0000-0000-0000-000000000001', true, 'Ch 2: Polynomials'),
('60000000-0000-0000-0000-000000000003', 'Pair of Linear Equations in Two Variables', 3, 'Solving linear equations in two variables', '50000000-0000-0000-0000-000000000001', true, 'Ch 3: Linear Equations'),
('60000000-0000-0000-0000-000000000004', 'Quadratic Equations', 4, 'Solving quadratic equations using various methods', '50000000-0000-0000-0000-000000000001', true, 'Ch 4: Quadratic Equations'),
('60000000-0000-0000-0000-000000000005', 'Arithmetic Progressions', 5, 'Introduction to AP, nth term, sum of n terms', '50000000-0000-0000-0000-000000000001', true, 'Ch 5: AP'),
('60000000-0000-0000-0000-000000000006', 'Triangles', 6, 'Properties of triangles, similarity', '50000000-0000-0000-0000-000000000001', true, 'Ch 6: Triangles'),
('60000000-0000-0000-0000-000000000007', 'Coordinate Geometry', 7, 'Distance formula, section formula, area of triangle', '50000000-0000-0000-0000-000000000001', true, 'Ch 7: Coordinate Geometry'),
('60000000-0000-0000-0000-000000000008', 'Introduction to Trigonometry', 8, 'Trigonometric ratios and identities', '50000000-0000-0000-0000-000000000001', true, 'Ch 8: Trigonometry'),
('60000000-0000-0000-0000-000000000009', 'Circles', 9, 'Properties of circles, tangents', '50000000-0000-0000-0000-000000000001', true, 'Ch 9: Circles'),
('60000000-0000-0000-0000-000000000010', 'Areas Related to Circles', 10, 'Area and perimeter of circles and sectors', '50000000-0000-0000-0000-000000000001', true, 'Ch 10: Circle Areas')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 7. SAMPLE NOTES (Django structure)
-- ====================================================================

INSERT INTO notes (id, title, content, "order", chapter_id, note_type, bullet_points, examples, hashtags, is_published, quality_score, review_status) VALUES
('70000000-0000-0000-0000-000000000001', 
 'Real Numbers - Introduction', 
 '# Real Numbers

## What are Real Numbers?
Real numbers include all rational and irrational numbers.

### Types:
1. **Rational Numbers**: Can be expressed as p/q where q ≠ 0
   - Example: 1/2, 3/4, 5
2. **Irrational Numbers**: Cannot be expressed as p/q
   - Example: √2, π, e

## Euclid''s Division Algorithm
For any two positive integers a and b:
**a = bq + r** where 0 ≤ r < b

### Example:
Find HCF of 56 and 72
- 72 = 56 × 1 + 16
- 56 = 16 × 3 + 8
- 16 = 8 × 2 + 0

Therefore, HCF = 8',
 1,
 '60000000-0000-0000-0000-000000000001',
 'concept',
 '["Rational numbers can be expressed as fractions", "Irrational numbers cannot be expressed as fractions", "Euclid''s algorithm helps find HCF"]'::jsonb,
 '["√2 is irrational", "π is irrational", "1/2 is rational"]'::jsonb,
 '#RealNumbers #Mathematics #Class10',
 true,
 0.85,
 'approved'),

('70000000-0000-0000-0000-000000000002', 
 'Polynomials - Basics', 
 '# Polynomials

## Definition
A polynomial is an algebraic expression with one or more terms.

### Types by Degree:
1. **Linear** (degree 1): ax + b
2. **Quadratic** (degree 2): ax² + bx + c
3. **Cubic** (degree 3): ax³ + bx² + cx + d

### Types by Terms:
- **Monomial**: 1 term (e.g., 5x)
- **Binomial**: 2 terms (e.g., 3x + 2)
- **Trinomial**: 3 terms (e.g., x² + 5x + 6)

## Zeros of Polynomial
A zero of polynomial p(x) is a value α such that p(α) = 0',
 1,
 '60000000-0000-0000-0000-000000000002',
 'definition',
 '["Polynomial degree determines its type", "Zeros are values where p(x) = 0", "Monomials have 1 term, binomials have 2"]'::jsonb,
 '["x² - 5x + 6 has zeros at x=2 and x=3", "5x is a monomial", "3x + 2 is a binomial"]'::jsonb,
 '#Polynomials #Algebra #Mathematics',
 true,
 0.90,
 'approved'),

('70000000-0000-0000-0000-000000000003', 
 'Quadratic Equations - Solving Methods', 
 '# Quadratic Equations

## Standard Form
**ax² + bx + c = 0** where a ≠ 0

## Solving Methods

### 1. Factorization
Example: x² - 5x + 6 = 0
- (x - 2)(x - 3) = 0
- x = 2 or x = 3

### 2. Quadratic Formula
**x = (-b ± √(b² - 4ac)) / 2a**

## Discriminant (D = b² - 4ac)
- D > 0: Two distinct real roots
- D = 0: Two equal real roots
- D < 0: No real roots',
 1,
 '60000000-0000-0000-0000-000000000004',
 'explanation',
 '["Three main methods: factorization, completing square, formula", "Discriminant tells us about nature of roots", "Quadratic formula works for all cases"]'::jsonb,
 '["2x² - 7x + 3 = 0 gives x = 3 or x = 1/2", "x² - 6x + 9 = 0 has D = 0, so x = 3 (repeated root)"]'::jsonb,
 '#QuadraticEquations #Algebra #Class10',
 true,
 0.92,
 'approved')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 8. SAMPLE POLLS (with options as JSON)
-- ====================================================================

INSERT INTO polls (id, chapter_id, question, description, options, correct_answer, explanation, poll_type, is_published, quality_score, review_status, total_votes) VALUES
('90000000-0000-0000-0000-000000000001',
 '60000000-0000-0000-0000-000000000001',
 'Which math chapter do you find most interesting?',
 'Help us understand student preferences',
 '["Algebra", "Geometry", "Trigonometry", "Coordinate Geometry"]'::jsonb,
 NULL,
 NULL,
 'opinion',
 true,
 0.75,
 'approved',
 0),

('90000000-0000-0000-0000-000000000002',
 '60000000-0000-0000-0000-000000000001',
 'Which of the following is TRUE about rational numbers?',
 'Knowledge check on rational numbers',
 '["All integers are rational", "All rational numbers are integers", "π is rational", "√2 is rational"]'::jsonb,
 'All integers are rational',
 'All integers can be expressed as p/1 where p is the integer, making them rational numbers.',
 'knowledge',
 true,
 0.88,
 'approved',
 0)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 9. SAMPLE QA ITEMS (Questions & Answers)
-- ====================================================================

INSERT INTO qa_items (id, question, answer, chapter_id, question_type, options, difficulty, explanation, is_published, quality_score, review_status) VALUES
('80000000-0000-0000-0000-000000000001',
 'Which of the following is an irrational number?',
 '√2',
 '60000000-0000-0000-0000-000000000001',
 'MCQ',
 '["√4", "√9", "√2", "√16"]'::jsonb,
 'Easy',
 '√2 cannot be expressed as a fraction p/q, making it irrational. The other options (√4=2, √9=3, √16=4) are all perfect squares and therefore rational.',
 true,
 0.85,
 'approved'),

('80000000-0000-0000-0000-000000000002',
 'What is the HCF of 12 and 18?',
 '6',
 '60000000-0000-0000-0000-000000000001',
 'MCQ',
 '["2", "3", "6", "9"]'::jsonb,
 'Medium',
 'Using Euclid''s algorithm: 18 = 12×1 + 6, then 12 = 6×2 + 0. Therefore, HCF = 6',
 true,
 0.90,
 'approved'),

('80000000-0000-0000-0000-000000000003',
 'The decimal expansion of a rational number is:',
 'Either terminating or non-terminating repeating',
 '60000000-0000-0000-0000-000000000001',
 'MCQ',
 '["Always terminating", "Always non-terminating", "Either terminating or non-terminating repeating", "Never terminating"]'::jsonb,
 'Medium',
 'Rational numbers have either terminating decimal expansions (like 1/4 = 0.25) or non-terminating repeating expansions (like 1/3 = 0.333...).',
 true,
 0.87,
 'approved'),

('80000000-0000-0000-0000-000000000004',
 'Explain Euclid''s Division Algorithm with an example.',
 'Euclid''s Division Algorithm states that for any two positive integers a and b, there exist unique integers q and r such that a = bq + r, where 0 ≤ r < b. Example: For a=56 and b=15: 56 = 15×3 + 11 (here q=3, r=11)',
 '60000000-0000-0000-0000-000000000001',
 'LongAnswer',
 '[]'::jsonb,
 'Hard',
 'This is a fundamental theorem used to find HCF of two numbers. The algorithm repeatedly applies the division until remainder becomes 0.',
 true,
 0.92,
 'approved')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- VERIFICATION QUERIES
-- ====================================================================

-- Check table counts
SELECT 
  'boards' as table_name, COUNT(*) as count FROM boards
UNION ALL SELECT 'mediums', COUNT(*) FROM mediums
UNION ALL SELECT 'classes', COUNT(*) FROM classes
UNION ALL SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL SELECT 'books', COUNT(*) FROM books
UNION ALL SELECT 'chapters', COUNT(*) FROM chapters
UNION ALL SELECT 'notes', COUNT(*) FROM notes
UNION ALL SELECT 'polls', COUNT(*) FROM polls
UNION ALL SELECT 'qa_items', COUNT(*) FROM qa_items;

-- ====================================================================
-- DONE! Django-matched seed data inserted successfully! 🎉
-- ====================================================================
-- You now have:
-- - 4 Boards (CBSE, ICSE, etc.)
-- - 6 Mediums (English, Hindi, Tamil, etc.)
-- - 6 Classes (9-12 for CBSE, 9-10 for ICSE)
-- - 5 Subjects (Math, Science, English, Social, Hindi)
-- - 2 Books
-- - 10 Chapters (Math Class 10)
-- - 3 Notes (Django structure with bullet_points, examples, etc.)
-- - 2 Polls (options as JSON array)
-- - 4 QA Items (questions with answers)
-- ====================================================================
