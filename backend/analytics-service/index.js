/* =============================================
   AURA – Analytics & Safety Operations Microservice
   Handles metrics, incidents, and broadcasts with file persistence
   ============================================= */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8006;

const DB_PATH = path.join(__dirname, '../../data/db.json');

app.use(cors());
app.use(express.json());

// Helper: read db
function readDB() {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        console.error("Error reading database", e);
        return {};
    }
}

// Helper: write db
function writeDB(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing database", e);
    }
}

app.get('/health', (req, res) => {
    res.json({ service: 'analytics-service', status: 'UP', timestamp: new Date() });
});

// GET Metrics (polling view updates)
app.get('/metrics', (req, res) => {
    const db = readDB();
    
    // Simulate real-time slight shifts in metrics
    let metrics = db.metrics || { fanCount: 67842, crowdDensity: 78, activeIncidents: 3, transportArrivals: 12450 };
    metrics.fanCount += Math.round((Math.random() - 0.3) * 15);
    metrics.crowdDensity = Math.max(40, Math.min(98, metrics.crowdDensity + Math.round((Math.random() - 0.5) * 2)));
    metrics.transportArrivals += Math.round(Math.random() * 20);
    
    db.metrics = metrics;
    writeDB(db);

    res.json(metrics);
});

// GET Active Incidents
app.get('/incidents', (req, res) => {
    const db = readDB();
    res.json(db.incidents || []);
});

// POST New Incident
app.post('/incidents', (req, res) => {
    const { type, zone, summary } = req.body;
    if (!type || !zone || !summary) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const db = readDB();
    const list = db.incidents || [];
    const newInc = {
        id: list.length + 1,
        type,
        status: "active",
        summary,
        zone,
        time: "Just now"
    };

    list.unshift(newInc);
    db.incidents = list;
    db.metrics = db.metrics || {};
    db.metrics.activeIncidents = (db.metrics.activeIncidents || 0) + 1;
    writeDB(db);

    res.status(201).json(newInc);
});

// POST Broadcast message
app.post('/broadcast', (req, res) => {
    const { target, message } = req.body;
    console.log(`[BROADCAST TO ${target.toUpperCase()}]: ${message}`);
    res.json({ success: true, timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Analytics & Operations Service running on port ${PORT}`);
});
