/* =============================================
   AURA – User Management Service
   ============================================= */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8002;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ service: 'user-service', status: 'UP', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
