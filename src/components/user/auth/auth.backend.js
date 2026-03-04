import express from 'express';

const router = express.Router();

// In-memory users "database"
let users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' }
];

let nextId = 2;

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Fake async lookup using a small timeout
    const user = await new Promise((resolve) => {
      const found = users.find(
        (u) => u.username === username && u.password === password
      );
      setTimeout(() => resolve(found), 50);
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const { id, role } = user;
    return res.json({ id, username, role });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/auth/create-waiter
router.post('/create-waiter', async (req, res) => {
  try {
    // Simple "auth": read role from header
    const requesterRole = req.header('X-User-Role');

    if (requesterRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create waiters.' });
    }

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const existing = users.find((u) => u.username === username);
    if (existing) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const newUser = await new Promise((resolve) => {
      const created = {
        id: nextId++,
        username,
        password,
        role: 'waiter'
      };
      users.push(created);
      setTimeout(() => resolve(created), 50);
    });

    const { id, role } = newUser;
    return res.status(201).json({ id, username, role });
  } catch (error) {
    console.error('Create waiter error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;

