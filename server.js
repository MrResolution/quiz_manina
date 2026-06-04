const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');

const fs = require('fs');

const app = express();
const PORT = 8080;

// PostgreSQL Connection Pool Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_qb7sAUvSVt0e@ep-floral-mouse-aohyrhki-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve frontend directly from root

// Test Connection and Run Schema Migrations
pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('Database connection warning (Make sure your network allows outbound port 5432):', err.message);
  } else {
    console.log('Database connected successfully to Neon. Current Time:', res.rows[0].now);
    
    // Automatically initialize schema tables and seed default users
    try {
      const sqlPath = path.join(__dirname, 'init.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        await pool.query(sql);
        console.log('Database schemas verified and seeded successfully on Neon cloud database!');
      }
    } catch (migrationErr) {
      console.error('Failed to run database migrations:', migrationErr);
    }
  }
});

// ==========================================
// AUTH ENDPOINTS
// ==========================================

// Register Account
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  
  try {
    const checkUser = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role, xp) VALUES ($1, $2, $3, 0) RETURNING id, username, role, xp',
      [username, hashedPassword, role || 'student']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Login Account
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      xp: user.xp
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ==========================================
// USER ENDPOINTS
// ==========================================

// Get User Profile
app.get('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const userResult = await pool.query('SELECT id, username, role, xp FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const user = userResult.rows[0];
    
    // Fetch attempts
    const attemptsResult = await pool.query(
      'SELECT COUNT(*) as completed, COALESCE(SUM(total_questions), 0) as total_answers, COALESCE(SUM(correct_count), 0) as correct_answers FROM attempts WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    
    const stats = attemptsResult.rows[0];
    
    // Fetch badges (Simulate badges based on achievements since they are stored dynamically in client side or database. Let's read from database user badges column - wait, let's add a user_badges table or keep it simple. Let's add user_badges table dynamically or query distinct unlocked badges from attempts or add user_badges schema)
    const badgesResult = await pool.query('SELECT badge_id FROM user_badges WHERE user_id = $1', [user.id]).catch(() => ({ rows: [] }));
    
    res.json({
      username: user.username,
      role: user.role,
      xp: user.xp,
      quizzesCompleted: parseInt(stats.completed) || 0,
      totalAnswers: parseInt(stats.total_answers) || 0,
      correctAnswers: parseInt(stats.correct_answers) || 0,
      badges: badgesResult.rows.map(r => r.badge_id)
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error fetching user profile.' });
  }
});

// Update XP
app.post('/api/users/:username/update-xp', async (req, res) => {
  const { username } = req.params;
  const { xp } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET xp = xp + $1 WHERE LOWER(username) = LOWER($2) RETURNING xp',
      [xp, username]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ xp: result.rows[0].xp });
  } catch (error) {
    console.error('Error updating XP:', error);
    res.status(500).json({ error: 'Server error updating XP.' });
  }
});

// ==========================================
// QUIZ ENDPOINTS
// ==========================================

// Get All Quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzesResult = await pool.query('SELECT * FROM quizzes ORDER BY created_at DESC');
    const quizzes = quizzesResult.rows;
    
    const fullQuizzes = [];
    for (let q of quizzes) {
      const questionsResult = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [q.id]);
      fullQuizzes.push({
        id: q.id,
        title: q.title,
        description: q.description,
        category: q.category,
        difficulty: q.difficulty,
        timeLimit: q.time_limit,
        passingScore: q.passing_score,
        maxAttempts: q.max_attempts,
        shuffleQuestions: q.shuffle_questions,
        shuffleAnswers: q.shuffle_answers,
        createdBy: q.created_by,
        questions: questionsResult.rows.map(question => ({
          question: question.question,
          type: question.type,
          options: question.options,
          answer: question.answer,
          correct_text: question.correct_text,
          explanation: question.explanation
        }))
      });
    }
    res.json(fullQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Server error fetching quizzes.' });
  }
});

// Get Specific Quiz with Questions
app.get('/api/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }
    
    const quiz = quizResult.rows[0];
    const questionsResult = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [id]);
    
    res.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimit: quiz.time_limit,
      passingScore: quiz.passing_score,
      maxAttempts: quiz.max_attempts,
      shuffleQuestions: quiz.shuffle_questions,
      shuffleAnswers: quiz.shuffle_answers,
      createdBy: quiz.created_by,
      questions: questionsResult.rows.map(q => ({
        question: q.question,
        type: q.type,
        options: q.options,
        answer: q.answer,
        correct_text: q.correct_text,
        explanation: q.explanation
      }))
    });
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({ error: 'Server error fetching quiz details.' });
  }
});

// Create Custom Quiz
app.post('/api/quizzes/create', async (req, res) => {
  const { id, title, description, category, difficulty, timeLimit, passingScore, maxAttempts, shuffleQuestions, shuffleAnswers, createdBy, questions } = req.body;
  
  if (!id || !title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'Invalid quiz payload.' });
  }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert Quiz
    await client.query(
      `INSERT INTO quizzes (id, title, description, category, difficulty, time_limit, passing_score, max_attempts, shuffle_questions, shuffle_answers, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, title, description, category, difficulty, timeLimit || 30, passingScore || 50, maxAttempts || 0, shuffleQuestions !== false, shuffleAnswers !== false, createdBy || null]
    );
    
    // Insert Questions
    for (let q of questions) {
      await client.query(
        `INSERT INTO questions (quiz_id, question, type, options, answer, correct_text, explanation)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, q.question, q.type || 'mcq', JSON.stringify(q.options || []), q.answer !== undefined ? q.answer : null, q.correct_text || null, q.explanation || '']
      );
    }
    
    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Quiz created successfully.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Server error creating quiz.' });
  } finally {
    client.release();
  }
});

// ==========================================
// ATTEMPTS & ANALYTICS ENDPOINTS
// ==========================================

// Log Quiz Attempt
app.post('/api/attempts/log', async (req, res) => {
  const { username, quizId, score, correctCount, totalQuestions, accuracyPct, passed, maxStreak, timeTaken, answersLog } = req.body;
  
  if (!username || !quizId) {
    return res.status(400).json({ error: 'Username and Quiz ID are required.' });
  }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert Attempt
    const attemptResult = await client.query(
      `INSERT INTO attempts (username, quiz_id, score, correct_count, total_questions, accuracy_pct, passed, max_streak, time_taken)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [username, quizId, score, correctCount, totalQuestions, accuracyPct, passed, maxStreak, timeTaken]
    );
    
    const attemptId = attemptResult.rows[0].id;
    
    // Insert Answers Log
    if (answersLog && Array.isArray(answersLog)) {
      for (let ans of answersLog) {
        await client.query(
          `INSERT INTO answers_log (attempt_id, question, selected, correct, is_correct, explanation)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [attemptId, ans.question, String(ans.selected), String(ans.correct), ans.isCorrect, ans.explanation]
        );
      }
    }
    
    // Check if badges need to be unlocked:
    // Create user_badges helper table dynamically if not exists on start, let's check first:
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        badge_id VARCHAR(50) NOT NULL,
        unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, badge_id)
      )
    `);
    
    // Fetch user ID
    const userResult = await client.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    const userId = userResult.rows[0]?.id;
    
    if (userId) {
      // 1. Completion badge
      await client.query('INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, 'first_quiz']);
      
      // 2. Perfect score
      if (score === 100) {
        await client.query('INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, 'perfect_score']);
      }
      // 3. Streak badges
      if (maxStreak >= 5) {
        await client.query('INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, 'streak_5']);
      }
      if (maxStreak >= 10) {
        await client.query('INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, 'streak_10']);
      }
      
      // Category specific badges: Tech / Space
      const quizResult = await client.query('SELECT category FROM quizzes WHERE id = $1', [quizId]);
      const category = quizResult.rows[0]?.category;
      if (category === 'Tech' && accuracyPct >= 80) {
        await client.query('INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, 'tech_master']);
      }
      if (category === 'Science' && accuracyPct >= 80) {
        await client.query('INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, 'space_explorer']);
      }
    }
    
    await client.query('COMMIT');
    res.status(201).json({ success: true, attemptId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error logging quiz attempt:', error);
    res.status(500).json({ error: 'Server error logging quiz attempt.' });
  } finally {
    client.release();
  }
});

// Get Attempt History for User
app.get('/api/attempts/history/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.*, q.title as quiz_title, q.category as quiz_category 
       FROM attempts a 
       JOIN quizzes q ON a.quiz_id = q.id 
       WHERE LOWER(a.username) = LOWER($1) 
       ORDER BY a.timestamp DESC`,
      [username]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attempt history:', error);
    res.status(500).json({ error: 'Server error fetching attempt history.' });
  }
});

// Get Analytics Summary & Hardest Questions
app.get('/api/analytics', async (req, res) => {
  try {
    // General stats
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*)::int as total_attempts,
        ROUND(COALESCE(AVG(accuracy_pct), 0))::int as avg_accuracy,
        ROUND(COALESCE(SUM(CASE WHEN passed THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) * 100, 0))::int as pass_rate
      FROM attempts
    `);
    
    // Hardest questions: Group by question text, success rate is ratio of is_correct = true
    const hardestResult = await pool.query(`
      SELECT 
        question, 
        COUNT(*)::int as total_answers, 
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::int as correct_answers,
        ROUND(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100)::int as success_rate
      FROM answers_log 
      GROUP BY question 
      ORDER BY success_rate ASC, total_answers DESC 
      LIMIT 5
    `);
    
    res.json({
      stats: statsResult.rows[0] || { total_attempts: 0, avg_accuracy: 0, pass_rate: 0 },
      hardestQuestions: hardestResult.rows
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Server error fetching analytics.' });
  }
});

// Leaderboard Dynamic Endpoint
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.username as name, 
        u.xp, 
        (SELECT COUNT(*) FROM attempts a WHERE LOWER(a.username) = LOWER(u.username))::int as quizzes,
        ROUND(COALESCE(
          (SELECT SUM(correct_count)::numeric / NULLIF(SUM(total_questions), 0) * 100 FROM attempts a WHERE LOWER(a.username) = LOWER(u.username)), 
          0
        )) || '%' as accuracy
      FROM users u
      ORDER BY u.xp DESC, name ASC
    `);
    
    // Add ranks dynamically
    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      name: row.name,
      xp: row.xp,
      quizzes: row.quizzes,
      accuracy: row.accuracy,
      avatar: row.name.slice(0, 2).toUpperCase()
    }));
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Server error fetching leaderboard.' });
  }
});

// ==========================================
// FRONTEND ROUTING FALLBACK
// ==========================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`QuizMania backend listening on port ${PORT}!`);
});
