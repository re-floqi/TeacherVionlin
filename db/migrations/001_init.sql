CREATE TYPE lesson_status AS ENUM ('scheduled', 'completed', 'canceled');

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    lesson_time TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    charge DECIMAL(10, 2) NOT NULL,
    status lesson_status DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recurring_lessons (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    frequency VARCHAR(50) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    charge DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);