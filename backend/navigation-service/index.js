/* =============================================
   AURA – Indoor & Concourse Navigation Service
   ============================================= */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());

// Indoor routing Dijkstra pathfinding goes here
app.post('/route', (req, res) => {
    const { fromZone, toZone } = req.body;
    res.json({
        path: [fromZone, 'East Concourse', 'Level 2 Ramp', toZone],
        durationSeconds: 180,
    });
});

app.listen(PORT, () => {
    console.log(`Navigation Service running on port ${PORT}`);
});
