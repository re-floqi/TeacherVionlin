-- Database Schema for Violin Teacher Lesson Tracking Application
-- This schema includes students, individual lessons, and recurring lesson rules

-- Drop existing types and tables if they exist (for clean reinstall)
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
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    imera_ora_enarksis TIMESTAMP WITH TIME ZONE NOT NULL,
    diarkeia_lepta INTEGER NOT NULL,
    timi NUMERIC(10, 2) NOT NULL,
    katastasi_pliromis payment_status DEFAULT 'pending',
    simiwseis_mathimatos TEXT
);

-- Recurring lessons rules table (Κανόνες επανάληψης)
CREATE TABLE recurring_lessons (
    recurring_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    imera_evdomadas INTEGER CHECK (imera_evdomadas BETWEEN 0 AND 6),
    ora_enarksis TIME NOT NULL,
    diarkeia_lepta INTEGER NOT NULL,
    timi NUMERIC(10, 2) NOT NULL,
    enarxi_epanallipsis DATE NOT NULL,
    lixi_epanallipsis DATE
);

-- Create indexes for better query performance
CREATE INDEX idx_lessons_student_id ON lessons(student_id);
CREATE INDEX idx_lessons_date ON lessons(imera_ora_enarksis);
CREATE INDEX idx_recurring_lessons_student_id ON recurring_lessons(student_id);
CREATE INDEX idx_recurring_lessons_day ON recurring_lessons(imera_evdomadas);

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (adjust based on your auth requirements)
-- These policies allow authenticated users to perform all operations
-- You may want to restrict these based on user roles or ownership

CREATE POLICY "Enable all for authenticated users" ON students
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON lessons
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON recurring_lessons
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Sample data (optional - for testing)
-- INSERT INTO students (onoma_mathiti, epitheto_mathiti, etos_gennisis, onoma_gonea, epitheto_gonea, kinhto_tilefono, email, megethos_violiou, default_diarkeia, default_timi)
-- VALUES 
--     ('Γιώργος', 'Παπαδόπουλος', 2015, 'Μαρία', 'Παπαδοπούλου', '6912345678', 'maria@example.com', '1/4', 40, 20.00),
--     ('Ελένη', 'Ιωάννου', 2013, 'Νίκος', 'Ιωάννου', '6987654321', 'nikos@example.com', '1/2', 45, 25.00);
