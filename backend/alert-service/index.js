/* =============================================
   AURA – Alert & Notification Broadcast Service
   ============================================= */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8004;

app.use(express.json());

app.post('/broadcast', (req, res) => {
    const { target, message } = req.body;
    // Broadcast trigger goes here (Kafka topic emitter, WebSockets)
    res.json({ status: 'sent', target, messageId: Math.random().toString(36).substring(7) });
});

app.listen(PORT, () => {
    console.log(`Alert Service running on port ${PORT}`);
});
