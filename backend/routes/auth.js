const express = require('express');
const router = express.Router();

const users = [
  { id: 1, email: 'student@test.com', password: 'student123', role: 'student', name: 'John Doe' },
  { id: 2, email: 'admin@test.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 3, email: 'jane@test.com', password: 'jane123', role: 'student', name: 'Jane Smith' }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/signup', (req, res) => {
  const { name, email, password, phone, address } = req.body;

  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    role: 'student'
  };

  users.push(newUser);

  res.json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  });
});

module.exports = router;
