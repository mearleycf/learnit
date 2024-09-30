-- Insert a test user
INSERT INTO users (email, name, role, enrolled_courses)
VALUES ('test@example.com', 'Test User', 'user', ARRAY[]::uuid[]);

-- Insert sample courses
INSERT INTO courses (title, description, language, level, price, slug, tags)
VALUES
  ('Introduction to Python', 'Learn the basics of Python programming', 'python', 'beginner', 49.99, 'intro-to-python', ARRAY['programming', 'python', 'beginner']),
  ('Advanced JavaScript', 'Master advanced JavaScript concepts', 'javascript', 'advanced', 79.99, 'advanced-javascript', ARRAY['programming', 'javascript', 'advanced']),
  ('React Fundamentals', 'Build modern web apps with React', 'react', 'intermediate', 59.99, 'react-fundamentals', ARRAY['programming', 'react', 'web development']);

-- Insert chapters for the Python course
INSERT INTO chapters (course_id, title, description, estimated_time, order_number)
VALUES
  ((SELECT id FROM courses WHERE slug = 'intro-to-python'), 'Getting Started with Python', 'Set up your environment and write your first Python program', '1 hour', 1),
  ((SELECT id FROM courses WHERE slug = 'intro-to-python'), 'Variables and Data Types', 'Learn about variables, strings, numbers, and booleans', '2 hours', 2),
  ((SELECT id FROM courses WHERE slug = 'intro-to-python'), 'Control Flow', 'Master if statements, loops, and conditional logic', '3 hours', 3);

-- Insert exercises for the Python course
INSERT INTO exercises (chapter_id, title, description, type, difficulty, estimated_time_minutes, initial_code, solution)
VALUES
  ((SELECT id FROM chapters WHERE title = 'Getting Started with Python'), 'Hello, World!', 'Write a program that prints "Hello, World!"', 'coding', 'easy', 5, 'print("Edit me")', 'print("Hello, World!")'),
  ((SELECT id FROM chapters WHERE title = 'Variables and Data Types'), 'Calculate Area', 'Write a function to calculate the area of a rectangle', 'coding', 'medium', 15, 'def calculate_area(length, width):\n    # Your code here', 'def calculate_area(length, width):\n    return length * width'),
  ((SELECT id FROM chapters WHERE title = 'Control Flow'), 'FizzBuzz', 'Implement the classic FizzBuzz problem', 'coding', 'hard', 30, 'def fizzbuzz(n):\n    # Your code here', 'def fizzbuzz(n):\n    for i in range(1, n+1):\n        if i % 15 == 0:\n            print("FizzBuzz")\n        elif i % 3 == 0:\n            print("Fizz")\n        elif i % 5 == 0:\n            print("Buzz")\n        else:\n            print(i)');

-- Insert some user progress
INSERT INTO user_progress (user_id, course_id, progress)
VALUES
  ((SELECT id FROM users WHERE email = 'test@example.com'), (SELECT id FROM courses WHERE slug = 'intro-to-python'), 0);

-- Insert some user exercise progress
INSERT INTO user_exercise_progress (user_id, exercise_id, attempts, completed, score)
VALUES
  ((SELECT id FROM users WHERE email = 'test@example.com'), (SELECT id FROM exercises WHERE title = 'Hello, World!'), 1, true, 100);

-- Insert a sample note
INSERT INTO notes (user_id, content_id, content_type, title, note_text)
VALUES
  ((SELECT id FROM users WHERE email = 'test@example.com'), (SELECT id FROM chapters WHERE title = 'Getting Started with Python'), 'chapter', 'Important setup steps', 'Remember to set the PYTHONPATH environment variable.');

-- Insert sample feedback
INSERT INTO feedback (user_id, content_id, content_type, title, description, rating, status)
VALUES
  ((SELECT id FROM users WHERE email = 'test@example.com'), (SELECT id FROM courses WHERE slug = 'intro-to-python'), 'course', 'Great course!', 'Really enjoyed the content and pacing.', 5, 'open');
