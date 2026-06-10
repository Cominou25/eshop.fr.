require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database initialization
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create products table
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create orders table
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  const tokenWithoutBearer = token.replace('Bearer ', '');
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Token invalid' });
    req.userId = decoded.id;
    next();
  });
};

// ROUTES

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    function(err) {
      if (err) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: this.lastID, username, email }
      });
    }
  );
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const passwordMatch = bcryptjs.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  });
});

// Get current user
app.get('/api/auth/me', verifyToken, (req, res) => {
  db.get('SELECT id, username, email FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'User not found' });
    }
    res.json(user);
  });
});

// Logout (client-side token removal)
app.post('/api/auth/logout', verifyToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      return res.status(400).json({ message: 'Error fetching products' });
    }
    res.json(products);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });
});

// Add product (admin only - for demo)
app.post('/api/products', verifyToken, (req, res) => {
  const { name, description, price, image, stock } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  db.run(
    'INSERT INTO products (name, description, price, image, stock) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, image, stock || 0],
    function(err) {
      if (err) {
        return res.status(400).json({ message: 'Error creating product' });
      }
      res.status(201).json({
        message: 'Product created',
        product: { id: this.lastID, name, description, price, image, stock }
      });
    }
  );
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
