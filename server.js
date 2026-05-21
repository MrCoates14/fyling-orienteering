const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) console.error('DB error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database schema
const initDB = () => {
  db.serialize(() => {
    // Courses table
    db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT,
        checkpoints TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Teams table
    db.run(`
      CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        house TEXT NOT NULL,
        year_group TEXT NOT NULL,
        members TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Results table
    db.run(`
      CREATE TABLE IF NOT EXISTS results (
        id TEXT PRIMARY KEY,
        team_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        start_time DATETIME,
        end_time DATETIME,
        total_time INTEGER,
        checkpoint_times TEXT,
        house TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(team_id) REFERENCES teams(id),
        FOREIGN KEY(course_id) REFERENCES courses(id)
      )
    `);

    // House points table
    db.run(`
      CREATE TABLE IF NOT EXISTS house_points (
        id TEXT PRIMARY KEY,
        house TEXT NOT NULL UNIQUE,
        total_points INTEGER DEFAULT 0,
        session_count INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database schema initialized');
  });
};

initDB();

// API Routes

// Get all courses
app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM courses', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a course (teacher)
app.post('/api/courses', (req, res) => {
  const { name, difficulty, description, checkpoints } = req.body;
  const id = uuidv4();

  db.run(
    'INSERT INTO courses (id, name, difficulty, description, checkpoints) VALUES (?, ?, ?, ?, ?)',
    [id, name, difficulty, description, JSON.stringify(checkpoints)],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, name, difficulty, description, checkpoints });
    }
  );
});

// Get all teams
app.get('/api/teams', (req, res) => {
  db.all('SELECT * FROM teams', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a team (student)
app.post('/api/teams', (req, res) => {
  const { name, house, year_group, members } = req.body;
  const id = uuidv4();

  db.run(
    'INSERT INTO teams (id, name, house, year_group, members) VALUES (?, ?, ?, ?, ?)',
    [id, name, house, year_group, JSON.stringify(members)],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, name, house, year_group, members });
    }
  );
});

// Submit a result (student app)
app.post('/api/results', (req, res) => {
  const { team_id, course_id, start_time, end_time, checkpoint_times, house } = req.body;
  const id = uuidv4();
  const total_time = Math.round((new Date(end_time) - new Date(start_time)) / 1000);

  db.run(
    'INSERT INTO results (id, team_id, course_id, start_time, end_time, total_time, checkpoint_times, house) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, team_id, course_id, start_time, end_time, total_time, JSON.stringify(checkpoint_times), house],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Update house points
      db.run(
        'INSERT INTO house_points (id, house, total_points) VALUES (?, ?, 100) ON CONFLICT(house) DO UPDATE SET total_points = total_points + 100, session_count = session_count + 1',
        [uuidv4(), house]
      );

      res.json({ id, team_id, course_id, total_time });
    }
  );
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const courseId = req.query.course_id;

  let query = `
    SELECT
      t.id, t.name, t.house,
      r.total_time, r.created_at,
      ROW_NUMBER() OVER (PARTITION BY r.course_id ORDER BY r.total_time ASC) as rank
    FROM results r
    JOIN teams t ON r.team_id = t.id
  `;

  if (courseId) {
    query += ` WHERE r.course_id = '${courseId}'`;
  }

  query += ` ORDER BY r.total_time ASC`;

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get house totals
app.get('/api/house-totals', (req, res) => {
  db.all('SELECT * FROM house_points ORDER BY total_points DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get course results (teacher dashboard)
app.get('/api/results/:courseId', (req, res) => {
  const { courseId } = req.params;

  db.all(
    `SELECT
      r.*, t.name, t.house
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE r.course_id = ?
    ORDER BY r.total_time ASC`,
    [courseId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Orienteering app running on http://localhost:${PORT}`);
});
