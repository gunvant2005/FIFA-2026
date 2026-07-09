/* =============================================
   AURA – Seating & Ticket Service
   ============================================= */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8005;

app.use(express.json());

app.get('/ticket/:id', (req, res) => {
    res.json({
        ticketId: req.params.id,
        seat: 'Section 204, Row G, Seat 12',
        zone: 'B',
        gate: 'Gate B',
    });
});

app.listen(PORT, () => {
    console.log(`Ticket Service running on port ${PORT}`);
});
