-- SQL Schema for Teacher Violin Lesson Tracking Application
-- This schema is designed for Supabase (PostgreSQL)

-- 1. Create custom ENUM type for payment status
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'cancelled');

-- 2. Create students table (μαθητές)
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    onoma_mathiti TEXT NOT NULL,
    epitheto_mathiti TEXT,
    etos_gennisis INTEGER,
    onoma_gonea TEXT,
    epitheto_gonea TEXT,
    kinhto_tilefono TEXT NOT NULL,
    email TEXT,
    megethos_violiou TEXT,
    default_diarkeia INTEGER DEFAULT 40,
    default_timi NUMERIC(10, 2),
    simiwseis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create lessons table (μεμονωμένα μαθήματα)
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    imera_ora_enarksis TIMESTAMP WITH TIME ZONE NOT NULL,
    diarkeia_lepta INTEGER NOT NULL,
    timi NUMERIC(10, 2) NOT NULL,
    katastasi_pliromis payment_status DEFAULT 'pending',
    simiwseis_mathimatos TEXT
);

-- 4. Create recurring_lessons table (κανόνες επανάληψης)
CREATE TABLE recurring_lessons (
    recurring_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    imera_evdomadas INTEGER NOT NULL CHECK (imera_evdomadas >= 0 AND imera_evdomadas <= 6),
    ora_enarksis TIME NOT NULL,
    diarkeia_lepta INTEGER NOT NULL,
    timi NUMERIC(10, 2) NOT NULL,
    enarxi_epanallipsis DATE NOT NULL,
    lixi_epanallipsis DATE
);

-- Create indexes for better query performance
CREATE INDEX idx_lessons_student_id ON lessons(student_id);
CREATE INDEX idx_lessons_imera_ora_enarksis ON lessons(imera_ora_enarksis);
CREATE INDEX idx_recurring_lessons_student_id ON recurring_lessons(student_id);
CREATE INDEX idx_recurring_lessons_imera_evdomadas ON recurring_lessons(imera_evdomadas);

-- Add comments to tables for documentation
COMMENT ON TABLE students IS 'Πίνακας μαθητών βιολιού';
COMMENT ON TABLE lessons IS 'Πίνακας μεμονωμένων μαθημάτων';
COMMENT ON TABLE recurring_lessons IS 'Πίνακας κανόνων επαναλαμβανόμενων μαθημάτων';

COMMENT ON COLUMN students.student_id IS 'Μοναδικό αναγνωριστικό μαθητή';
COMMENT ON COLUMN students.onoma_mathiti IS 'Όνομα μαθητή';
COMMENT ON COLUMN students.epitheto_mathiti IS 'Επώνυμο μαθητή';
COMMENT ON COLUMN students.etos_gennisis IS 'Έτος γέννησης μαθητή';
COMMENT ON COLUMN students.onoma_gonea IS 'Όνομα γονέα/κηδεμόνα';
COMMENT ON COLUMN students.epitheto_gonea IS 'Επώνυμο γονέα/κηδεμόνα';
COMMENT ON COLUMN students.kinhto_tilefono IS 'Κινητό τηλέφωνο επικοινωνίας';
COMMENT ON COLUMN students.email IS 'Διεύθυνση email';
COMMENT ON COLUMN students.megethos_violiou IS 'Μέγεθος βιολιού (π.χ. "4/4", "1/2")';
COMMENT ON COLUMN students.default_diarkeia IS 'Προεπιλεγμένη διάρκεια μαθήματος σε λεπτά';
COMMENT ON COLUMN students.default_timi IS 'Προεπιλεγμένη τιμή μαθήματος';
COMMENT ON COLUMN students.simiwseis IS 'Σημειώσεις για τον μαθητή';

COMMENT ON COLUMN lessons.lesson_id IS 'Μοναδικό αναγνωριστικό μαθήματος';
COMMENT ON COLUMN lessons.student_id IS 'Αναφορά στον μαθητή';
COMMENT ON COLUMN lessons.imera_ora_enarksis IS 'Ημερομηνία και ώρα έναρξης μαθήματος';
COMMENT ON COLUMN lessons.diarkeia_lepta IS 'Διάρκεια μαθήματος σε λεπτά';
COMMENT ON COLUMN lessons.timi IS 'Τιμή μαθήματος';
COMMENT ON COLUMN lessons.katastasi_pliromis IS 'Κατάσταση πληρωμής (pending, paid, cancelled)';
COMMENT ON COLUMN lessons.simiwseis_mathimatos IS 'Σημειώσεις για το μάθημα';

COMMENT ON COLUMN recurring_lessons.recurring_id IS 'Μοναδικό αναγνωριστικό κανόνα επανάληψης';
COMMENT ON COLUMN recurring_lessons.student_id IS 'Αναφορά στον μαθητή';
COMMENT ON COLUMN recurring_lessons.imera_evdomadas IS 'Ημέρα εβδομάδας (0=Κυριακή, 6=Σάββατο)';
COMMENT ON COLUMN recurring_lessons.ora_enarksis IS 'Ώρα έναρξης μαθήματος';
COMMENT ON COLUMN recurring_lessons.diarkeia_lepta IS 'Διάρκεια μαθήματος σε λεπτά';
COMMENT ON COLUMN recurring_lessons.timi IS 'Τιμή μαθήματος';
COMMENT ON COLUMN recurring_lessons.enarxi_epanallipsis IS 'Ημερομηνία έναρξης επανάληψης';
COMMENT ON COLUMN recurring_lessons.lixi_epanallipsis IS 'Ημερομηνία λήξης επανάληψης';
