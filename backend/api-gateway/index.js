/* =============================================
   AURA – API Gateway Microservice
   Routes request to services + implements JWT security
   ============================================= */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 8000;

const JWT_SECRET = process.env.JWT_SECRET || 'wc-2026-aura-super-secret-key';

app.use(cors());
app.use(express.json());

// Forwarding helper function
function forwardRequest(options, reqBody, res) {
    const serviceReq = http.request(options, (serviceRes) => {
        let body = '';
        serviceRes.on('data', chunk => body += chunk);
        serviceRes.on('end', () => {
            res.status(serviceRes.statusCode).set(serviceRes.headers).send(body);
        });
    });

    serviceReq.on('error', (err) => {
        console.error("Gateway forward error:", err.message);
        res.status(502).json({ error: "Service unavailable", details: err.message });
    });

    if (reqBody) {
        serviceReq.write(JSON.stringify(reqBody));
    }
    serviceReq.end();
}

// Authentication Middleware
function verifyStaffToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. Auth token required." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }
        req.user = decoded;
        next();
    });
}

app.get('/health', (req, res) => {
    res.json({ service: 'api-gateway', status: 'UP', timestamp: new Date() });
});

// Route 1: Auth Service Forwarding (8001)
app.post('/api/auth/login', (req, res) => {
    forwardRequest({
        hostname: 'localhost',
        port: 8001,
        path: '/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, req.body, res);
});

// Route 2: Analytics Service Forwarding (8006)
app.get('/api/metrics', (req, res) => {
    forwardRequest({
        hostname: 'localhost',
        port: 8006,
        path: '/metrics',
        method: 'GET'
    }, null, res);
});

// Route 3: Incident Log Routing (8006 - requires staff login)
app.get('/api/incidents', verifyStaffToken, (req, res) => {
    forwardRequest({
        hostname: 'localhost',
        port: 8006,
        path: '/incidents',
        method: 'GET'
    }, null, res);
});

app.post('/api/incidents', verifyStaffToken, (req, res) => {
    forwardRequest({
        hostname: 'localhost',
        port: 8006,
        path: '/incidents',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, req.body, res);
});

// Route 4: Broadcaster (8006 - requires staff login)
app.post('/api/broadcast', verifyStaffToken, (req, res) => {
    forwardRequest({
        hostname: 'localhost',
        port: 8006,
        path: '/broadcast',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, req.body, res);
});

// Route 5: Chat Service Forwarding (8008)
app.post('/api/chat', (req, res) => {
    forwardRequest({
        hostname: 'localhost',
        port: 8008,
        path: '/chat',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, req.body, res);
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});
