INSERT INTO students (id, name, email) VALUES
(1, 'John Doe', 'john.doe@example.com'),
(2, 'Jane Smith', 'jane.smith@example.com'),
(3, 'Emily Johnson', 'emily.johnson@example.com');

INSERT INTO lessons (id, student_id, lesson_time, duration, charge, status) VALUES
(1, 1, '2023-10-01 10:00:00', 60, 50.00, 'paid'),
(2, 1, '2023-10-08 10:00:00', 60, 50.00, 'unpaid'),
(3, 2, '2023-10-01 11:00:00', 30, 25.00, 'paid'),
(4, 3, '2023-10-02 09:00:00', 45, 40.00, 'paid');

INSERT INTO recurring_lessons (id, student_id, lesson_time, duration, charge, frequency) VALUES
(1, 1, '2023-10-15 10:00:00', 60, 50.00, 'weekly'),
(2, 2, '2023-10-01 11:00:00', 30, 25.00, 'bi-weekly');