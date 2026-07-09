/* =============================================
   AURA – Chat View (Production Config)
   AI Fan Assistant with voice + backend Gemini API
   ============================================= */

import { getState, setState } from '../state.js';
import { formatMessage } from '../utils.js';

const BACKEND_URL = 'http://localhost:8000';

// ── Fallback Chat Response Patterns ──
const chatResponses = {
    seat: {
        patterns: [/seat/i, /section\s*\d+/i, /where.*sit/i, /find.*seat/i, /my seat/i],
        response: (q) => {
            const m = q.match(/section\s*(\d+)/i);
            const section = m ? m[1] : '204';
            return `🪑 **Section ${section}** is located in **Zone B**, upper concourse level.\n\n📍 **Directions from your current location:**\n1. Head towards the **East Concourse** (follow blue signs)\n2. Take **Ramp 3** up to Level 2\n3. Turn **right** at the top — Section ${section} entrance is 50m ahead\n\n⏱️ Estimated walk time: **3 minutes**\n💡 *Tip: Section ${section} has a great view of the south goal. The nearest restroom is just 30m to your left after entering.*`;
        }
    },
    food: {
        patterns: [/food/i, /eat/i, /hungry/i, /restaurant/i, /snack/i, /drink/i, /beverage/i, /halal/i, /vegetarian/i, /vegan/i, /dietary/i, /popcorn/i],
        response: (q) => {
            if (/halal/i.test(q)) {
                return `🥗 **Halal Food Options Near You:**\n\n1. **Al-Amir Kitchen** — Zone B, Level 2 *(4 min walk)*\n   🌟 Shawarma, falafel, grilled chicken — ⭐ 4.7\n   🕐 Wait: ~5 min\n\n2. **Saffron Bites** — Zone D, Level 1 *(6 min walk)*\n   🌟 Biryani, kebabs, naan wraps — ⭐ 4.5\n   🕐 Wait: ~3 min\n\n3. **Mediterranean Grill** — Zone A, Level 2 *(5 min walk)*\n   🌟 Halal burgers, lamb kofta — ⭐ 4.6\n   🕐 Wait: ~7 min\n\n✅ All certified Halal by FIFA 2026 food standards.`;
            }
            return `🍔 **Nearby Food & Drinks:**\n\n1. **Stadium Grill** — 2 min walk (Zone B)\n   🌟 Burgers, hot dogs, fries — ⭐ 4.3\n   🕐 Current wait: ~4 min\n\n2. **Taco Fiesta** — 3 min walk (Zone A)\n   🌟 Tacos, nachos, quesadillas — ⭐ 4.6\n   🕐 Current wait: ~2 min | 🔥 *Shortest queue!*\n\n3. **Noodle Bar** — 5 min walk (Zone D)\n   🌟 Ramen, stir-fry, dumplings — ⭐ 4.8\n   🕐 Current wait: ~8 min\n\n🥤 **Drinks:** Pepsi kiosks every 100m. Craft beer at Level 2 lounges.\n💡 *The AI suggests Taco Fiesta — shortest queue right now!*`;
        }
    },
    restroom: {
        patterns: [/restroom/i, /bathroom/i, /toilet/i, /washroom/i, /wc/i, /loo/i],
        response: () => `🚻 **Nearest Restrooms:**\n\n1. **Level 1, East Wing** — 1 min walk ➡️\n   👥 Current occupancy: 60% | Wait: ~1 min\n\n2. **Level 2, Section 200 corridor** — 2 min walk ⬆️\n   👥 Current occupancy: 35% | ✨ *Recommended — least crowded!*\n\n3. **VIP Lounge area** — 3 min walk\n   👥 Current occupancy: 20% *(VIP ticket holders only)*\n\n♿ **Accessible restrooms** available at all locations (ground floor).\n👶 **Family restrooms** with baby changing at East & West Wings.`
    },
    exit: {
        patterns: [/exit/i, /leave/i, /way out/i, /emergency/i, /evacuate/i],
        response: () => `🚪 **Exit Routes:**\n\n📍 **Nearest Exit: East Gate (Gate B)** — 2 min walk\n→ Follow the illuminated green EXIT signs along the concourse\n\n📍 **Alternative Exits:**\n• **Gate A** (North) — 4 min walk | Density: 🟢 Low\n• **Gate D** (South) — 3 min walk | Density: 🟡 Medium\n• **Gate C** (West) — 5 min walk | Density: 🔴 High — avoid if possible\n\n⚡ **Emergency evacuation** routes are marked with red strobe lights.\n🅿️ Gate A is closest to **Parking Lot 1 & Metro Station**.\n\n💡 *AI recommends Gate A for the fastest post-match departure.*`
    },
    accessibility: {
        patterns: [/wheelchair/i, /accessible/i, /disability/i, /disabled/i, /mobility/i, /blind/i, /deaf/i, /accessibility/i],
        response: () => `♿ **Accessibility Information:**\n\n🦽 **Wheelchair Routes:**\n• All concourse levels connected by **elevators** (Zones A, D, F, J)\n• Ramp access at every gate entrance\n• Dedicated wheelchair seating in Sections 104, 118, 204, 318\n\n👁️ **Visual Impairment:**\n• Audio description service available on FM 94.5\n• Tactile guide maps at all information desks\n\n🦻 **Hearing Impairment:**\n• Live captions on all stadium screens\n• Sign language interpreters at Gates A & D\n\n🏥 **Medical Assistance:** Press the red button on any accessibility station or ask AURA for immediate help.\n\n📞 **Accessibility Hotline:** Dial 2026 on your mobile in-stadium.`
    },
    metro: {
        patterns: [/metro/i, /train/i, /subway/i, /transit/i, /bus/i, /transport/i, /get.*home/i, /uber/i, /taxi/i, /cab/i],
        response: () => `🚇 **Getting to the Metro Station:**\n\n📍 **Meadowlands Station** — 8 min walk from Gate A (North Exit)\n→ Turn left from Gate A → follow the covered walkway → station entrance on your right\n\n🕐 **Next departures:**\n• NJ Transit to **NYC Penn Station**: 3 min ⏱️\n• NJ Transit to **Hoboken**: 8 min ⏱️\n• Express to **Newark Airport**: 15 min ⏱️\n\n🚕 **Rideshare (Uber/Lyft):**\n• Pickup zone: **Lot K** (5 min walk from Gate D)\n• Current wait: ~8 min | Surge: 1.4x\n\n🚌 **Shuttle Buses:**\n• Free FIFA shuttle to Times Square: every 10 min\n• Runs until 2 hours after final whistle\n\n💡 *NJ Transit is the fastest option. Platform 2 for NYC-bound.*`
    },
    score: {
        patterns: [/score/i, /result/i, /winning/i, /goal/i, /who.*lead/i, /match.*update/i],
        response: () => `⚽ **Live Match Update:**\n\n🇧🇷 **Brazil 1 — 1 Argentina** 🇦🇷\n🕐 62nd minute | 🏟️ MetLife Stadium\n\n⚽ **Goals:**\n• 34' — Vinícius Jr. (BRA) | Free kick, top corner\n• 58' — Julián Álvarez (ARG) | Assist: Messi\n\n📊 **Match Stats:**\n• Possession: 🇧🇷 52% | 🇦🇷 48%\n• Shots on target: 5 — 4\n• Corners: 7 — 5\n\n🟨 **Cards:** 2 yellow (1 each)\n📺 *Next key moment predicted by AI: High press from Argentina expected in next 5 min*`
    },
};

const defaultResponse = `I appreciate your question! Let me help you with that.\n\n🤖 As AURA, I can assist you with:\n\n• 🪑 **Finding your seat** — "Where is Section 204?"\n• 🍔 **Food & drinks** — "Best halal food nearby?"\n• 🚻 **Restrooms** — "Nearest restroom?"\n• 🚪 **Exit routes** — "How do I exit?"\n• ♿ **Accessibility** — "Wheelchair routes?"\n• 🚇 **Transport** — "How to get to the metro?"\n• ⚽ **Match updates** — "What's the score?"\n\nTry asking me one of these, or anything else about your stadium experience! I'm here to help in 20+ languages. 🌍`;

function getLocalResponse(query) {
    for (const [, data] of Object.entries(chatResponses)) {
        if (data.patterns?.some(p => p.test(query))) {
            return data.response(query);
        }
    }
    return defaultResponse;
}

// ── Message Handling ──
function addMessage(text, isUser = false) {
    const container = document.getElementById('chat-messages');
    const welcome = container?.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    msgDiv.innerHTML = `
        <div class="message-avatar">${isUser ? 'You' : 'AI'}</div>
        <div>
            <div class="message-bubble">${formatMessage(text)}</div>
            <span class="message-time">${time}</span>
        </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

async function handleSend() {
    const input = document.getElementById('chat-input');
    const query = input.value.trim();
    if (!query) return;

    addMessage(query, true);
    input.value = '';

    // Typing indicator
    const container = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-msg';
    typingDiv.innerHTML = `<div class="message-avatar">AI</div><div><div class="message-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>`;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;

    try {
        // Query server
        const res = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        
        document.getElementById('typing-msg')?.remove();

        if (!res.ok) {
            throw new Error("HTTP error");
        }

        const data = await res.json();
        addMessage(data.response);
    } catch (e) {
        // Fallback to local simulator
        setTimeout(() => {
            document.getElementById('typing-msg')?.remove();
            addMessage(getLocalResponse(query));
        }, 600);
    }
}

let _isListening = false;

export function init() {
    // Send button
    document.getElementById('send-btn')?.addEventListener('click', handleSend);
    document.getElementById('chat-input')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleSend();
    });

    // Quick chips
    document.querySelectorAll('.quick-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const input = document.getElementById('chat-input');
            input.value = chip.dataset.query;
            // Navigate to chat view if not already there
            document.querySelector('[data-view="chat"]')?.click();
            setTimeout(handleSend, 100);
        });
    });

    // Voice input
    const voiceBtn = document.getElementById('voice-btn');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (e) => {
            document.getElementById('chat-input').value = e.results[0][0].transcript;
            voiceBtn.classList.remove('listening');
            _isListening = false;
            handleSend();
        };
        recognition.onerror = () => { voiceBtn.classList.remove('listening'); _isListening = false; };
        recognition.onend = () => { voiceBtn.classList.remove('listening'); _isListening = false; };

        voiceBtn?.addEventListener('click', () => {
            if (_isListening) { recognition.stop(); }
            else { recognition.start(); voiceBtn.classList.add('listening'); _isListening = true; }
        });
    } else if (voiceBtn) {
        voiceBtn.style.opacity = '0.3';
        voiceBtn.title = 'Voice input not supported in this browser';
    }
}

export function enter() {
    return [];
}
