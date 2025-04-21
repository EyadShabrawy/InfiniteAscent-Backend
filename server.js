const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(sql, [username, password], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, username });
    });
});

// Login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, user) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const { password: _, ...userData } = user;
        res.json(userData);
    });
});

// Get user data
app.get('/user/:id', (req, res) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(row);
    });
});

// Update user coins
app.put('/update-coins', (req, res) => {
    const { id, coins } = req.body;
    const sql = `UPDATE users SET coins = ? WHERE id = ?`;
    db.run(sql, [coins, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Coins updated successfully' });
    });
});

// Update armor_level
app.put('/update-armor', (req, res) => {
    const { id, level } = req.body;
    const sql = `UPDATE users SET armor_level = ? WHERE id = ?`;
    db.run(sql, [level, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Armor level updated successfully' });
    });
});

// Update damage_level
app.put('/update-damage', (req, res) => {
    const { id, level } = req.body;
    const sql = `UPDATE users SET damage_level = ? WHERE id = ?`;
    db.run(sql, [level, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Damage level updated successfully' });
    });
});

// Update speed_level
app.put('/update-speed', (req, res) => {
    const { id, level } = req.body;
    const sql = `UPDATE users SET speed_level = ? WHERE id = ?`;
    db.run(sql, [level, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Speed level updated successfully' });
    });
});

// Delete user
app.delete('/user/:id', (req, res) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'User deleted' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
