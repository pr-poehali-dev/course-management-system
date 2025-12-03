-- Insert demo users (password for all: password123)
INSERT INTO users (email, password_hash, role, full_name, phone) VALUES
('ivan.petrov@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'teacher', 'Иванов Петр', '+7 999 111-22-33'),
('anna.smirnova@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'teacher', 'Смирнова Анна', '+7 999 222-33-44'),
('maria.petrova@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'parent', 'Петрова Мария', '+7 999 123-45-67'),
('admin@detcentr.ru', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'admin', 'Администратор', '+7 495 123-45-67');

-- Insert teachers
INSERT INTO teachers (user_id, rate_per_student, bio) VALUES
(1, 350.00, 'Опыт преподавания робототехники более 8 лет'),
(2, 300.00, 'Художник с высшим педагогическим образованием');

-- Insert demo courses
INSERT INTO courses (title, description, age_min, age_max, schedule, duration_minutes, price_per_month, total_spots, available_spots, room, image_emoji, teacher_id) VALUES
('Робототехника для начинающих', 'Изучаем основы робототехники и программирования', 7, 10, 'ПН, СР 16:00-17:30', 90, 3500.00, 12, 8, 'Кабинет 201', '🤖', 1),
('Рисование и творчество', 'Развиваем творческие способности через искусство', 5, 8, 'ВТ, ЧТ 15:00-16:00', 60, 2800.00, 10, 3, 'Кабинет 105', '🎨', 2),
('Шахматы для детей', 'Развиваем логическое мышление и стратегию', 6, 12, 'ПН, ПТ 17:00-18:00', 60, 3000.00, 15, 5, 'Кабинет 302', '♟️', NULL),
('Английский язык', 'Изучаем английский в игровой форме', 8, 12, 'ВТ, ЧТ 16:30-18:00', 90, 4000.00, 8, 2, 'Кабинет 203', '🇬🇧', NULL),
('Программирование Scratch', 'Создаем игры и анимации в Scratch', 8, 11, 'ПН, СР 17:30-19:00', 90, 3800.00, 10, 6, 'Кабинет 201', '💻', 1);

-- Insert demo student
INSERT INTO students (parent_id, full_name, birth_date, age, balance) VALUES
(3, 'Иван Петров', '2015-03-15', 9, 8);

-- Insert enrollments
INSERT INTO enrollments (student_id, course_id, status) VALUES
(1, 1, 'active'),
(1, 5, 'active');

-- Insert attendance records
INSERT INTO attendance (enrollment_id, lesson_date, lesson_time, status, absence_reason) VALUES
(1, '2024-03-04', '16:00-17:30', 'present', NULL),
(2, '2024-03-04', '17:30-19:00', 'present', NULL),
(1, '2024-03-06', '16:00-17:30', 'absent', 'Болезнь (справка)'),
(2, '2024-03-06', '17:30-19:00', 'upcoming', NULL);

-- Insert payment record
INSERT INTO payments (student_id, amount, lessons_purchased, payment_method, payment_status, paid_at) VALUES
(1, 7000.00, 8, 'card', 'completed', '2024-03-01 14:30:00');
