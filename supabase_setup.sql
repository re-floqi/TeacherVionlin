-- ============================================================================
-- Complete Supabase Database Setup for TeacherVionlin Application
-- ============================================================================
-- This file contains the complete database schema and configuration.
-- Run this entire script in your Supabase SQL Editor with a single copy-paste.
--
-- What this script does:
-- 1. Creates the database schema (tables, types, indexes)
-- 2. Enables Row Level Security (RLS)
-- 3. Creates proper RLS policies for all operations
-- 4. Sets up CASCADE delete relationships
-- 5. Grants necessary permissions
-- 6. Creates helper functions for complex operations
--
-- IMPORTANT: Run this script only once when setting up a new database.
-- If you need to update an existing database, review the changes carefully.
-- ============================================================================

-- ============================================================================
-- PART 1: SCHEMA CREATION
-- ============================================================================

-- Drop existing types and tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS student_progress CASCADE;
DROP TABLE IF EXISTS recurring_lessons CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- Create custom ENUM type for payment status
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'cancelled');

-- Students table (Μαθητές)
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    onoma_mathiti VARCHAR(100) NOT NULL,
    epitheto_mathiti VARCHAR(100),
    etos_gennisis INTEGER,
    onoma_gonea VARCHAR(100),
    epitheto_gonea VARCHAR(100),
    kinhto_tilefono VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    megethos_violiou VARCHAR(10),
    default_diarkeia INTEGER DEFAULT 40,
    default_timi NUMERIC(10, 2),
    simiwseis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual lessons table (Μεμονωμένα μαθήματα)
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    imera_ora_enarksis TIMESTAMP WITH TIME ZONE NOT NULL,
    diarkeia_lepta INTEGER NOT NULL,
    timi NUMERIC(10, 2) NOT NULL,
    katastasi_pliromis payment_status DEFAULT 'pending',
    simiwseis_mathimatos TEXT
);

-- Recurring lessons rules table (Κανόνες επανάληψης)
CREATE TABLE recurring_lessons (
    recurring_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    imera_evdomadas INTEGER CHECK (imera_evdomadas BETWEEN 0 AND 6),
    ora_enarksis TIME NOT NULL,
    diarkeia_lepta INTEGER NOT NULL,
    timi NUMERIC(10, 2) NOT NULL,
    enarxi_epanallipsis DATE NOT NULL,
    lixi_epanallipsis DATE
);

-- Student Progress Tracking table (Παρακολούθηση προόδου μαθητή)
CREATE TABLE student_progress (
    progress_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    imera_kataxorisis TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    perigrafi TEXT NOT NULL,
    skill_level INTEGER CHECK (skill_level BETWEEN 1 AND 5),
    kommati_mousikis VARCHAR(255),
    simiwseis TEXT,
    created_by VARCHAR(100)
);

-- ============================================================================
-- PART 2: CREATE INDEXES
-- ============================================================================

-- Create indexes for better query performance
CREATE INDEX idx_lessons_student_id ON lessons(student_id);
CREATE INDEX idx_lessons_date ON lessons(imera_ora_enarksis);
CREATE INDEX idx_lessons_payment_status ON lessons(katastasi_pliromis);
CREATE INDEX idx_recurring_lessons_student_id ON recurring_lessons(student_id);
CREATE INDEX idx_recurring_lessons_day ON recurring_lessons(imera_evdomadas);
CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_student_progress_date ON student_progress(imera_kataxorisis);

-- ============================================================================
-- PART 3: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 4: DROP OLD POLICIES (IF ANY)
-- ============================================================================

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable all for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON lessons;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON recurring_lessons;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON student_progress;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON students;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON lessons;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON lessons;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON lessons;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON lessons;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON recurring_lessons;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON recurring_lessons;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON recurring_lessons;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON recurring_lessons;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON student_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON student_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON student_progress;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON student_progress;

-- ============================================================================
-- PART 5: CREATE RLS POLICIES FOR EACH OPERATION
-- ============================================================================

-- Students table policies
CREATE POLICY "Enable read access for authenticated users" ON students
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON students
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON students
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON students
    FOR DELETE
    TO authenticated
    USING (true);

-- Lessons table policies
CREATE POLICY "Enable read access for authenticated users" ON lessons
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON lessons
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON lessons
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON lessons
    FOR DELETE
    TO authenticated
    USING (true);

-- Recurring lessons table policies
CREATE POLICY "Enable read access for authenticated users" ON recurring_lessons
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON recurring_lessons
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON recurring_lessons
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON recurring_lessons
    FOR DELETE
    TO authenticated
    USING (true);

-- Student progress table policies
CREATE POLICY "Enable read access for authenticated users" ON student_progress
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON student_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON student_progress
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON student_progress
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- PART 6: CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to safely delete a student and all related records
CREATE OR REPLACE FUNCTION delete_student_with_cascade(student_id_param INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Delete student (CASCADE will handle related records)
    DELETE FROM students WHERE student_id = student_id_param;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_student_with_cascade(INTEGER) TO authenticated;

-- ============================================================================
-- PART 7: GRANT PERMISSIONS
-- ============================================================================

-- Ensure authenticated users have proper permissions on the tables
GRANT ALL ON students TO authenticated;
GRANT ALL ON lessons TO authenticated;
GRANT ALL ON recurring_lessons TO authenticated;
GRANT ALL ON student_progress TO authenticated;

-- Grant usage on sequences for INSERT operations
GRANT USAGE, SELECT ON SEQUENCE students_student_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE lessons_lesson_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE recurring_lessons_recurring_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE student_progress_progress_id_seq TO authenticated;

-- ============================================================================
-- PART 8: VERIFICATION QUERIES (OPTIONAL - COMMENT OUT IF NOT NEEDED)
-- ============================================================================

-- Uncomment the following queries to verify the setup:

-- Check policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd 
-- FROM pg_policies 
-- WHERE tablename IN ('students', 'lessons', 'recurring_lessons', 'student_progress')
-- ORDER BY tablename, policyname;

-- Check foreign key constraints:
-- SELECT tc.table_name, tc.constraint_name, tc.constraint_type, 
--        kcu.column_name, ccu.table_name AS foreign_table_name,
--        ccu.column_name AS foreign_column_name,
--        rc.delete_rule, rc.update_rule
-- FROM information_schema.table_constraints AS tc
-- JOIN information_schema.key_column_usage AS kcu
--   ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage AS ccu
--   ON ccu.constraint_name = tc.constraint_name
-- JOIN information_schema.referential_constraints AS rc
--   ON rc.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY'
--   AND tc.table_name IN ('lessons', 'recurring_lessons', 'student_progress')
-- ORDER BY tc.table_name;

-- Check tables:
-- SELECT table_name, row_security 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
--   AND table_name IN ('students', 'lessons', 'recurring_lessons', 'student_progress');

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- 
-- Next steps:
-- 1. Create a user in Supabase Authentication (if not already done)
-- 2. Use that user's credentials to log in to the TeacherVionlin app
-- 3. Test the following operations:
--    - Add a student
--    - Add a lesson
--    - Edit lesson payment status
--    - Delete a lesson
--    - Delete a student (will cascade delete all related data)
--    - Add recurring lesson rules
--    - Add student progress entries
--
-- Important notes:
-- - All CRUD operations now work properly with separate RLS policies
-- - CASCADE delete is configured to automatically delete related records
-- - All policies allow authenticated users to perform all operations
-- - For production, consider adding user_id columns to restrict access
--   to each user's own data
--
-- ============================================================================
