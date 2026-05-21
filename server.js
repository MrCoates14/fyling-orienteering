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
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('DB error:', err);
  else console.log('Connected to SQLite database at ' + dbPath);
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
        team TEXT NOT NULL,
        house TEXT NOT NULL,
        course TEXT NOT NULL,
        time INTEGER,
        checkpointsScanned INTEGER,
        totalCheckpoints INTEGER,
        completed INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
  const team = req.body.team;
  const house = req.body.house;
  const course = req.body.course;
  const time = req.body.time;
  const checkpointsScanned = req.body.checkpointsScanned;
  const totalCheckpoints = req.body.totalCheckpoints;
  const completed = req.body.completed || false;
  const id = uuidv4();

  // Calculate points: 5 per checkpoint + 100 bonus if complete - time penalty (1 per 10 seconds)
  let points = checkpointsScanned * 5;
  if (completed) {
    points += 100 - Math.floor(time / 10);
  }
  points = Math.max(0, points); // Don't allow negative points

  db.run(
    `INSERT INTO results (id, team, house, course, time, checkpointsScanned, totalCheckpoints, completed, points, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [id, team, house, course, time, checkpointsScanned, totalCheckpoints, completed ? 1 : 0, points],
    (err) => {
      if (err) {
        console.error('Insert error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ id, team, house, course, time, points });
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
    `SELECT * FROM results
    WHERE course = ?
    ORDER BY time ASC`,
    [courseId],
    (err, rows) => {
      if (err) {
        console.error('Query error:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      // Ensure boolean fields are properly formatted
      const formattedRows = (rows || []).map(r => ({
        ...r,
        completed: Boolean(r.completed)
      }));
      res.json(formattedRows);
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
