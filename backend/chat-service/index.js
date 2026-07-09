/* =============================================
   AURA – Gemini GenAI Chat Microservice
   Binds to port 8008. Uses Gemini Developer API.
   ============================================= */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8008;

// Load dotenv to read .env config
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SYSTEM_PROMPTS_PATH = path.join(__dirname, '../../ai-services/genai-chat/prompt_templates/system_prompts.json');

app.use(cors());
app.use(express.json());

// Load System Prompt Config
function getSystemPrompt() {
    try {
        const raw = fs.readFileSync(SYSTEM_PROMPTS_PATH, 'utf8');
        const prompts = JSON.parse(raw);
        return prompts.general_stadium_assistant || "";
    } catch (e) {
        return "You are AURA, the AI Unified Real-time Assistant for the FIFA World Cup 2026.";
    }
}

// Fallback Pattern Matching responses if no API key is provided
const fallbackResponses = {
    seat: "🪑 **Section 204** is located in **Zone B**, upper concourse level.\n\n📍 **Directions from your current location:**\n1. Head towards the **East Concourse** (follow blue signs)\n2. Take **Ramp 3** up to Level 2\n3. Turn **right** at the top — Section 204 entrance is 50m ahead\n\n⏱️ Estimated walk time: **3 minutes**",
    food: "🍔 **Nearby Food & Drinks:**\n\n1. **Stadium Grill** — 2 min walk (Zone B)\n   🌟 Burgers, hot dogs, fries — ⭐ 4.3\n   🕐 Current wait: ~4 min\n\n2. **Taco Fiesta** — 3 min walk (Zone A)\n   🌟 Tacos, nachos, quesadillas — ⭐ 4.6\n   🕐 Current wait: ~2 min | 🔥 *Shortest queue!*\n\n3. **Noodle Bar** — 5 min walk (Zone D)\n   🌟 Ramen, stir-fry, dumplings — ⭐ 4.8\n   🕐 Current wait: ~8 min\n\n🥤 **Drinks:** Pepsi kiosks every 100m. Craft beer at Level 2 lounges.",
    restroom: "🚻 **Nearest Restrooms:**\n\n1. **Level 1, East Wing** — 1 min walk ➡️\n   👥 Current occupancy: 60% | Wait: ~1 min\n\n2. **Level 2, Section 200 corridor** — 2 min walk ⬆️\n   👥 Current occupancy: 35% | ✨ *Recommended — least crowded!*",
    exit: "🚪 **Exit Routes:**\n\n📍 **Nearest Exit: East Gate (Gate B)** — 2 min walk\n→ Follow the illuminated green EXIT signs along the concourse\n\n📍 **Alternative Exits:**\n• **Gate A** (North) — 4 min walk | Density: 🟢 Low\n• **Gate D** (South) — 3 min walk | Density: 🟡 Medium",
    accessibility: "♿ **Accessibility Information:**\n\n🦽 **Wheelchair Routes:**\n• All concourse levels connected by **elevators** (Zones A, D, F, J)\n• Ramp access at every gate entrance\n• Dedicated wheelchair seating in Sections 104, 118, 204, 318",
    metro: "🚇 **Getting to the Metro Station:**\n\n📍 **Meadowlands Station** — 8 min walk from Gate A (North Exit)\n→ Turn left from Gate A → follow the covered walkway → station entrance on your right\n\n🕐 **Next departures:**\n• NJ Transit to **NYC Penn Station**: 3 min ⏱️\n• NJ Transit to **Hoboken**: 8 min ⏱️",
    score: "⚽ **Live Match Update:**\n\n🇧🇷 **Brazil 1 — 1 Argentina** 🇦🇷\n🕐 62nd minute | 🏟️ MetLife Stadium\n\n⚽ **Goals:**\n• 34' — Vinícius Jr. (BRA) | Free kick, top corner\n• 58' — Julián Álvarez (ARG) | Assist: Messi"
};

function getFallbackResponse(q) {
    if (/seat/i.test(q)) return fallbackResponses.seat;
    if (/food|eat|hungry|halal/i.test(q)) return fallbackResponses.food;
    if (/restroom|bathroom|toilet|washroom/i.test(q)) return fallbackResponses.restroom;
    if (/exit|leave|way out/i.test(q)) return fallbackResponses.exit;
    if (/wheelchair|accessible|disabled|mobility/i.test(q)) return fallbackResponses.accessibility;
    if (/metro|train|subway|transit|bus/i.test(q)) return fallbackResponses.metro;
    if (/score|result|goal|match/i.test(q)) return fallbackResponses.score;
    return `I appreciate your question about the stadium!\n\n🤖 As AURA, I can help you find your seat, locate concessions, find restrooms/exits, check metro timetables, or get live score updates. Try asking one of these!`;
}

app.get('/health', (req, res) => {
    res.json({ service: 'chat-service', status: 'UP', hasApiKey: !!GEMINI_API_KEY, timestamp: new Date() });
});

app.post('/chat', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query parameter" });

    // Fallback if key is missing or not provided
    if (!GEMINI_API_KEY) {
        console.log("No GEMINI_API_KEY found. Falling back to pattern-matching simulator.");
        return res.json({ response: getFallbackResponse(query), simulated: true });
    }

    try {
        const sysPrompt = getSystemPrompt();
        const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: `System Instruction: ${sysPrompt}\n\nUser Question: ${query}` }
                    ]
                }
            ],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7
            }
        };

        const apiRes = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiRes.ok) {
            const errBody = await apiRes.text();
            throw new Error(`Gemini API returned error code ${apiRes.status}: ${errBody}`);
        }

        const data = await apiRes.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that right now. Let me know if there's anything else I can help you with!";
        
        res.json({ response: aiText, simulated: false });

    } catch (e) {
        console.error("Gemini GenAI Connection failed:", e.message);
        res.status(500).json({ error: "GenAI Error", details: e.message, fallback: getFallbackResponse(query) });
    }
});

app.listen(PORT, () => {
    console.log(`Chat Service running on port ${PORT}`);
});
