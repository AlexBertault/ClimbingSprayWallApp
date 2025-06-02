const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./climbs.db');

// Create climbs table if it doesn't exist
// Holds will be stored as a JSON string
// Add fields for name, description, grade, creator, location, and holds
// id is auto-incremented

db.run(`
  CREATE TABLE IF NOT EXISTS climbs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    grade TEXT,
    creator TEXT,
    location TEXT,
    holds TEXT
  )
`);

// POST /climbs - Add a new climb
app.post('/climbs', (req, res) => {
  const { name, description, grade, creator, location, holds } = req.body;
  if (!name || !holds) {
    return res.status(400).json({ error: 'Name and holds are required.' });
  }
  db.run(
    'INSERT INTO climbs (name, description, grade, creator, location, holds) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description || '', grade || '', creator || '', location || '', JSON.stringify(holds)],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// GET /climbs?search=... - Search climbs by name, description, or location
app.get('/climbs', (req, res) => {
  const search = req.query.search || '';
  db.all(
    `SELECT * FROM climbs WHERE name LIKE ? OR description LIKE ? OR location LIKE ? ORDER BY id DESC`,
    [`%${search}%`, `%${search}%`, `%${search}%`],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // Parse holds JSON before returning
      const climbs = rows.map(row => ({ ...row, holds: JSON.parse(row.holds) }));
      res.json(climbs);
    }
  );
});

// GET /climbs/:id - Get a single climb by ID
app.get('/climbs/:id', (req, res) => {
  db.get('SELECT * FROM climbs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Climb not found.' });
    }
    row.holds = JSON.parse(row.holds);
    res.json(row);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 