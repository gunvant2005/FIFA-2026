/* =============================================
   AURA – Authentication Microservice (JWT)
   ============================================= */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8001;

const JWT_SECRET = process.env.JWT_SECRET || 'wc-2026-aura-super-secret-key';
const DB_PATH = path.join(__dirname, '../../data/db.json');

app.use(cors());
app.use(express.json());

// Load database users helper
function getUsers() {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(raw).users || [];
    } catch (e) {
        console.error("Error reading database", e);
        return [];
    }
}

app.get('/health', (req, res) => {
    res.json({ service: 'auth-service', status: 'UP', timestamp: new Date() });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Sign token valid for 24h
        const token = jwt.sign(
            { username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ success: true, token, role: user.role });
    } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

// Verify token helper route
app.post('/verify', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ valid: false, message: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }
        res.json({ valid: true, user: decoded });
    });
});

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
