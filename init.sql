-- CREATE DATABASE TABLES

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student',
  xp INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  time_limit INT DEFAULT 30,
  passing_score INT DEFAULT 50,
  max_attempts INT DEFAULT 0,
  shuffle_questions BOOLEAN DEFAULT TRUE,
  shuffle_answers BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(50) REFERENCES users(username) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  quiz_id VARCHAR(100) REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'mcq',
  options JSONB, -- Array of string options
  answer INT, -- Index of correct option (MCQ/TF)
  correct_text TEXT, -- Text answer (Short Answer)
  explanation TEXT
);

CREATE TABLE IF NOT EXISTS attempts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
  quiz_id VARCHAR(100) REFERENCES quizzes(id) ON DELETE CASCADE,
  score INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  total_questions INT DEFAULT 0,
  accuracy_pct INT DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  max_streak INT DEFAULT 0,
  time_taken VARCHAR(20),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers_log (
  id SERIAL PRIMARY KEY,
  attempt_id INT REFERENCES attempts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  selected VARCHAR(255),
  correct VARCHAR(255),
  is_correct BOOLEAN DEFAULT FALSE,
  explanation TEXT
);

CREATE TABLE IF NOT EXISTS rooms (
  pin VARCHAR(6) PRIMARY KEY,
  quiz_id VARCHAR(100) REFERENCES quizzes(id) ON DELETE CASCADE,
  host_username VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'lobby',
  current_question_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_participants (
  room_pin VARCHAR(6) REFERENCES rooms(pin) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  score INT DEFAULT 0,
  last_answered_question_index INT DEFAULT -1,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (room_pin, username)
);

ALTER TABLE room_participants ADD COLUMN IF NOT EXISTS last_answered_question_index INT DEFAULT -1;

-- SEED USERS (password is 'password')
INSERT INTO users (username, password, role, xp)
VALUES 
  ('student', '$2a$10$RY3YGBvZw8tw2BYht9J.n.iKrXuV9QL7L7ckMpK6trCo8i0nUiRpC', 'student', 0),
  ('teacher', '$2a$10$RY3YGBvZw8tw2BYht9J.n.iKrXuV9QL7L7ckMpK6trCo8i0nUiRpC', 'teacher', 0)
ON CONFLICT (username) DO NOTHING;

