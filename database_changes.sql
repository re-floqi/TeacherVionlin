-- Database Changes for TeacherVionlin Application
-- These changes fix deletion and editing operations that are not working correctly
-- Run these queries in your Supabase SQL editor

-- ============================================================================
-- 1. Drop existing policies that may be causing issues
-- ============================================================================

DROP POLICY IF EXISTS "Enable all for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON lessons;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON recurring_lessons;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON student_progress;

-- ============================================================================
-- 2. Create more explicit policies for each operation
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
-- 3. Ensure CASCADE delete is properly configured
-- ============================================================================

-- Drop existing foreign key constraints and recreate them with proper CASCADE
ALTER TABLE lessons 
    DROP CONSTRAINT IF EXISTS lessons_student_id_fkey;

ALTER TABLE lessons 
    ADD CONSTRAINT lessons_student_id_fkey 
    FOREIGN KEY (student_id) 
    REFERENCES students(student_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

ALTER TABLE recurring_lessons 
    DROP CONSTRAINT IF EXISTS recurring_lessons_student_id_fkey;

ALTER TABLE recurring_lessons 
    ADD CONSTRAINT recurring_lessons_student_id_fkey 
    FOREIGN KEY (student_id) 
    REFERENCES students(student_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

ALTER TABLE student_progress 
    DROP CONSTRAINT IF EXISTS student_progress_student_id_fkey;

ALTER TABLE student_progress 
    ADD CONSTRAINT student_progress_student_id_fkey 
    FOREIGN KEY (student_id) 
    REFERENCES students(student_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

-- ============================================================================
-- 4. Create helpful functions for complex operations (optional)
-- ============================================================================

-- Function to safely delete a student and all related records
CREATE OR REPLACE FUNCTION delete_student_with_cascade(student_id_param INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete student (CASCADE will handle related records)
    DELETE FROM students WHERE student_id = student_id_param;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_student_with_cascade(INTEGER) TO authenticated;

-- ============================================================================
-- 5. Create indexes if they don't exist (for better performance)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_lessons_student_id ON lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_lessons_date ON lessons(imera_ora_enarksis);
CREATE INDEX IF NOT EXISTS idx_lessons_payment_status ON lessons(katastasi_pliromis);
CREATE INDEX IF NOT EXISTS idx_recurring_lessons_student_id ON recurring_lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_recurring_lessons_day ON recurring_lessons(imera_evdomadas);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_date ON student_progress(imera_kataxorisis);

-- ============================================================================
-- 6. Grant necessary permissions to authenticated role
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
-- 7. Verify the changes
-- ============================================================================

-- You can run these queries to verify the changes were applied:
-- 
-- Check policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd 
-- FROM pg_policies 
-- WHERE tablename IN ('students', 'lessons', 'recurring_lessons', 'student_progress');
--
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
--   AND tc.table_name IN ('lessons', 'recurring_lessons', 'student_progress');

-- ============================================================================
-- Notes:
-- ============================================================================
-- 1. These policies allow all authenticated users to perform all operations.
--    If you need more granular control (e.g., users can only see their own
--    students), you'll need to add user_id columns and adjust policies.
--
-- 2. The CASCADE DELETE is configured to automatically delete related records
--    when a student is deleted (lessons, recurring_lessons, student_progress).
--
-- 3. Make sure you test these changes in a development environment before
--    applying them to production.
--
-- 4. After running these changes, test the following operations in your app:
--    - Delete a student
--    - Delete a lesson
--    - Edit a lesson
--    - Edit a payment status
--    - Delete a recurring lesson rule
--    - Edit a recurring lesson rule
