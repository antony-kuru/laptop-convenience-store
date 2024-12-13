// server.js
require('dotenv').config(); // Ensure you load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Correct path to your db.js
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Your API endpoints here...

// Middleware to authenticate using JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get all products
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Add a new product (Admin only)
app.post('/api/products', (req, res) => {
    const { name, price, description, image_url } = req.body;
    const query = 'INSERT INTO products (name, price, description, image_url) VALUES (?, ?, ?, ?)';
    db.query(query, [name, price, description, image_url], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ id: results.insertId });
    });
});

// User Registration
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: err });
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.status(201).json({ id: results.insertId });
        });
    });
});

// User Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Unauthorized' });
        const user = results[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (err || !match) return res.status(401).json({ error: 'Unauthorized' });
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        });
    });
});

// Get user's cart
app.get('/api/cart', authenticateToken, (req, res) => {
    db.query('SELECT * FROM carts WHERE user_id = ?', [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Add item to cart
app.post('/api/cart', authenticateToken, (req, res) => {
    const { product_id, quantity } = req.body;
    db.query('INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, quantity], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ id: results.insertId });
    });
});

// Remove item from cart
app.delete('/api/cart/:id', authenticateToken, (req, res) => {
    db.query('DELETE FROM carts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.sendStatus(204);
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});