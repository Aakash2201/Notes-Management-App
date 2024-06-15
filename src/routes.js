const express   = require('express');
const pool      = require('./db');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'Milind@9395';

// Registration Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.rows[0].id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Note Route
router.post('/notes', async (req, res) => {
  const { token, note } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const result = await pool.query('INSERT INTO notes (user_id, content) VALUES ($1, $2) RETURNING *', [userId, note]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View Notes Route
router.get('/notes', async (req, res) => {
  const { token } = req.headers;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const result = await pool.query('SELECT * FROM notes WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
