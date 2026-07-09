/* =============================================
   AURA – AI Unified Real-time Assistant
   FIFA World Cup 2026 Smart Stadium Platform
   Application Logic
   ============================================= */

// ── State ──
const state = {
    currentView: 'dashboard',
    chatMessages: [],
    isListening: false,
    fanCount: 67842,
    crowdDensity: 78,
    activeIncidents: 3,
    transportArrivals: 12450,
    fanFlowData: [],
    gateData: {},
    zoneData: {},
};

// ── Particle Background ──
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.3 + 0.1,
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ── Navigation ──
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view');
    const pageTitle = document.getElementById('page-title');
    const titles = {
        dashboard: 'Command Center',
        chat: 'AI Fan Assistant',
        navigator: 'Stadium Navigator',
        operations: 'Operations Copilot',
        transport: 'Transport Intelligence',
        sustainability: 'Sustainability Dashboard',
    };

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const view = link.dataset.view;
            if (view === state.currentView) return;

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            views.forEach(v => v.classList.remove('active'));
            document.getElementById(`view-${view}`).classList.add('active');

            pageTitle.textContent = titles[view] || view;
            state.currentView = view;

            // Close mobile sidebar
            document.getElementById('sidebar').classList.remove('open');
        });
    });

    // Mobile menu toggle
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

// ── Clock ──
function initClock() {
    function update() {
        const now = new Date();
        document.getElementById('sidebar-time').textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    update();
    setInterval(update, 1000);
}

// ── Dashboard: Fan Flow Chart ──
function initFanFlowChart() {
    const canvas = document.getElementById('fan-flow-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Generate initial data
    const dataPoints = 40;
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
        const hour = 14 + (i / dataPoints) * 5;
        const base = Math.sin((i / dataPoints) * Math.PI) * 60000 + 20000;
        data.push({
            time: `${Math.floor(hour)}:${String(Math.floor((hour % 1) * 60)).padStart(2, '0')}`,
            value: Math.max(0, base + (Math.random() - 0.5) * 8000),
        });
    }
    state.fanFlowData = data;

    function draw() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const w = rect.width;
        const h = rect.height;
        const padding = { top: 20, right: 20, bottom: 30, left: 50 };
        const plotW = w - padding.left - padding.right;
        const plotH = h - padding.top - padding.bottom;

        ctx.clearRect(0, 0, w, h);

        const maxVal = Math.max(...data.map(d => d.value));

        // Grid lines
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (plotH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
            ctx.font = '10px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round((maxVal / 4) * (4 - i)).toLocaleString(), padding.left - 8, y + 4);
        }

        // X-axis labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        for (let i = 0; i < data.length; i += 8) {
            const x = padding.left + (i / (data.length - 1)) * plotW;
            ctx.fillText(data[i].time, x, h - 8);
        }

        // Area fill
        const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0.01)');

        ctx.beginPath();
        ctx.moveTo(padding.left, h - padding.bottom);
        data.forEach((d, i) => {
            const x = padding.left + (i / (data.length - 1)) * plotW;
            const y = padding.top + (1 - d.value / maxVal) * plotH;
            if (i === 0) ctx.lineTo(x, y);
            else {
                const prevX = padding.left + ((i - 1) / (data.length - 1)) * plotW;
                const prevY = padding.top + (1 - data[i - 1].value / maxVal) * plotH;
                const cpx = (prevX + x) / 2;
                ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
            }
        });
        ctx.lineTo(padding.left + plotW, h - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Line
        ctx.beginPath();
        data.forEach((d, i) => {
            const x = padding.left + (i / (data.length - 1)) * plotW;
            const y = padding.top + (1 - d.value / maxVal) * plotH;
            if (i === 0) ctx.moveTo(x, y);
            else {
                const prevX = padding.left + ((i - 1) / (data.length - 1)) * plotW;
                const prevY = padding.top + (1 - data[i - 1].value / maxVal) * plotH;
                const cpx = (prevX + x) / 2;
                ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
            }
        });
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Current point
        const lastD = data[data.length - 1];
        const lx = padding.left + plotW;
        const ly = padding.top + (1 - lastD.value / maxVal) * plotH;
        ctx.beginPath();
        ctx.arc(lx, ly, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lx, ly, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    draw();
    window.addEventListener('resize', draw);

    // Live update
    setInterval(() => {
        state.fanFlowData.shift();
        const last = state.fanFlowData[state.fanFlowData.length - 1];
        const newVal = Math.max(5000, last.value + (Math.random() - 0.48) * 3000);
        const now = new Date();
        state.fanFlowData.push({
            time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
            value: newVal,
        });
        draw();
    }, 3000);
}

// ── Dashboard: Gate Bars ──
function initGateBars() {
    const container = document.getElementById('gate-bars');
    if (!container) return;
    const gates = [
        { name: 'Gate A', throughput: 85, color: '#00d4ff' },
        { name: 'Gate B', throughput: 72, color: '#00e676' },
        { name: 'Gate C', throughput: 91, color: '#f5a623' },
        { name: 'Gate D', throughput: 58, color: '#a855f7' },
        { name: 'Gate E', throughput: 67, color: '#ec4899' },
        { name: 'Gate F', throughput: 43, color: '#448aff' },
    ];

    container.innerHTML = gates.map(g => `
        <div class="gate-bar-item">
            <span class="gate-bar-label">${g.name}</span>
            <div class="gate-bar-track">
                <div class="gate-bar-fill" style="width:${g.throughput}%;background:linear-gradient(90deg,${g.color}88,${g.color})"></div>
            </div>
            <span class="gate-bar-value">${g.throughput}%</span>
        </div>
    `).join('');

    // Live update
    setInterval(() => {
        const items = container.querySelectorAll('.gate-bar-item');
        items.forEach(item => {
            const fill = item.querySelector('.gate-bar-fill');
            const val = item.querySelector('.gate-bar-value');
            const newVal = Math.max(20, Math.min(98, parseInt(val.textContent) + Math.round((Math.random() - 0.5) * 8)));
            fill.style.width = newVal + '%';
            val.textContent = newVal + '%';
        });
    }, 4000);
}

// ── Dashboard: Zone Grid ──
function initZoneGrid() {
    const container = document.getElementById('zone-grid');
    if (!container) return;
    const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const densities = [65, 82, 71, 45, 88, 55, 93, 40, 60, 72];

    function getColor(pct) {
        if (pct < 50) return { bg: 'rgba(0,230,118,0.25)', text: '#00e676' };
        if (pct < 70) return { bg: 'rgba(255,171,0,0.25)', text: '#ffab00' };
        if (pct < 85) return { bg: 'rgba(255,107,53,0.25)', text: '#ff6b35' };
        return { bg: 'rgba(255,82,82,0.3)', text: '#ff5252' };
    }

    function render() {
        container.innerHTML = zones.map((z, i) => {
            const c = getColor(densities[i]);
            return `<div class="zone-cell" style="background:${c.bg};color:${c.text}">
                <span class="zone-name">${z}</span>
                <span class="zone-pct">${densities[i]}%</span>
            </div>`;
        }).join('');
    }
    render();

    setInterval(() => {
        densities.forEach((d, i) => {
            densities[i] = Math.max(15, Math.min(98, d + Math.round((Math.random() - 0.5) * 6)));
        });
        render();
    }, 5000);
}

// ── Dashboard: AI Summary ──
function initAISummary() {
    const container = document.getElementById('ai-summary-content');
    if (!container) return;

    const summaries = [
        `<p>⚽ <span class="ai-highlight">42nd minute</span> — Brazil leads 1-0 after a stunning free kick by Vinícius Jr. Stadium atmosphere is electric with <span class="ai-highlight">67,842 fans</span> on their feet.</p>
         <p>📊 Crowd density in <span class="ai-highlight">Zone G is at 93%</span> — recommending staff redeployment to manage concourse flow. Zones D & H remain comfortable at under 50%.</p>
         <p>🌡️ Temperature has dropped 2°C in the last hour. HVAC system auto-adjusted. <span class="ai-highlight">No weather alerts</span> expected for the remainder of the match.</p>`,

        `<p>⚽ <span class="ai-highlight">58th minute</span> — Argentina equalizes! Messi with a magnificent assist to Álvarez. The noise level readings peaked at <span class="ai-highlight">128 dB</span>.</p>
         <p>🚶 Post-goal movement surge detected — <span class="ai-highlight">+15% concourse traffic</span> in the following 3 minutes. Food court queues averaging 4.2 minutes.</p>
         <p>🔒 All security checkpoints operating normally. Zero incidents reported in the last 30 minutes.</p>`,

        `<p>⚽ <span class="ai-highlight">75th minute</span> — Tactical substitutions by both teams. Match intensity increasing with <span class="ai-highlight">12 corner kicks</span> total.</p>
         <p>🚍 Pre-departure transport analysis: <span class="ai-highlight">23% of fans</span> are expected to leave within 5 minutes of final whistle. Metro capacity at 72%.</p>
         <p>♻️ Sustainability update: Recycling rate at <span class="ai-highlight">78%</span> — ahead of tournament target by 8 points.</p>`
    ];

    let idx = 0;

    function showSummary() {
        container.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        setTimeout(() => {
            container.innerHTML = summaries[idx % summaries.length];
            idx++;
        }, 1500);
    }

    showSummary();
    setInterval(showSummary, 20000);
}

// ── Dashboard: Alerts ──
function initAlerts() {
    const container = document.getElementById('dashboard-alerts');
    if (!container) return;

    const alerts = [
        { icon: '🔴', text: 'Zone G density exceeds 90% — crowd management team alerted', type: 'danger', time: '2 min ago' },
        { icon: '⚠️', text: 'Gate C throughput spike — additional scanners activated', type: 'warning', time: '5 min ago' },
        { icon: '✅', text: 'Medical team responded to Section 118 — situation resolved', type: 'success', time: '8 min ago' },
        { icon: '🔵', text: 'AI detected unusual movement pattern near East concourse', type: 'info', time: '12 min ago' },
        { icon: '⚠️', text: 'Food vendor Section 200 running low on beverages', type: 'warning', time: '15 min ago' },
    ];

    container.innerHTML = alerts.map(a => `
        <div class="alert-item ${a.type}">
            <span class="alert-icon">${a.icon}</span>
            <div class="alert-content">
                <div class="alert-text">${a.text}</div>
                <div class="alert-time">${a.time}</div>
            </div>
        </div>
    `).join('');
}

// ── Dashboard: KPI Updates ──
function initKPIUpdates() {
    setInterval(() => {
        state.fanCount += Math.round((Math.random() - 0.3) * 50);
        state.fanCount = Math.max(50000, Math.min(82000, state.fanCount));
        document.getElementById('kpi-fans-value').textContent = state.fanCount.toLocaleString();

        state.crowdDensity += Math.round((Math.random() - 0.5) * 3);
        state.crowdDensity = Math.max(40, Math.min(98, state.crowdDensity));
        document.getElementById('kpi-density-value').textContent = state.crowdDensity + '%';

        state.transportArrivals += Math.round(Math.random() * 80);
        document.getElementById('kpi-transport-value').textContent = state.transportArrivals.toLocaleString();
    }, 5000);
}

// ── Chat: AI Responses ──
const chatResponses = {
    seat: {
        patterns: [/seat/i, /section\s*\d+/i, /where.*sit/i, /find.*seat/i, /my seat/i],
        response: (q) => {
            const sectionMatch = q.match(/section\s*(\d+)/i);
            const section = sectionMatch ? sectionMatch[1] : '204';
            return `🪑 **Section ${section}** is located in **Zone B**, upper concourse level.

📍 **Directions from your current location:**
1. Head towards the **East Concourse** (follow blue signs)
2. Take **Ramp 3** up to Level 2
3. Turn **right** at the top — Section ${section} entrance is 50m ahead

⏱️ Estimated walk time: **3 minutes**
💡 *Tip: Section ${section} has a great view of the south goal. The nearest restroom is just 30m to your left after entering.*`;
        }
    },
    food: {
        patterns: [/food/i, /eat/i, /hungry/i, /restaurant/i, /snack/i, /drink/i, /beverage/i, /halal/i, /vegetarian/i, /vegan/i, /dietary/i, /popcorn/i],
        response: (q) => {
            const isHalal = /halal/i.test(q);
            const isVeg = /veg/i.test(q);
            if (isHalal) {
                return `🥗 **Halal Food Options Near You:**

1. **Al-Amir Kitchen** — Zone B, Level 2 *(4 min walk)*
   🌟 Shawarma, falafel, grilled chicken — ⭐ 4.7
   🕐 Wait: ~5 min

2. **Saffron Bites** — Zone D, Level 1 *(6 min walk)*
   🌟 Biryani, kebabs, naan wraps — ⭐ 4.5
   🕐 Wait: ~3 min

3. **Mediterranean Grill** — Zone A, Level 2 *(5 min walk)*
   🌟 Halal burgers, lamb kofta — ⭐ 4.6
   🕐 Wait: ~7 min

✅ All certified Halal by FIFA 2026 food standards.`;
            }
            return `🍔 **Nearby Food & Drinks:**

1. **Stadium Grill** — 2 min walk (Zone B)
   🌟 Burgers, hot dogs, fries — ⭐ 4.3
   🕐 Current wait: ~4 min

2. **Taco Fiesta** — 3 min walk (Zone A)
   🌟 Tacos, nachos, quesadillas — ⭐ 4.6
   🕐 Current wait: ~2 min | 🔥 *Shortest queue!*

3. **Noodle Bar** — 5 min walk (Zone D)
   🌟 Ramen, stir-fry, dumplings — ⭐ 4.8
   🕐 Current wait: ~8 min

🥤 **Drinks:** Pepsi kiosks every 100m. Craft beer at Level 2 lounges.
💡 *The AI suggests Taco Fiesta — shortest queue right now!*`;
        }
    },
    restroom: {
        patterns: [/restroom/i, /bathroom/i, /toilet/i, /washroom/i, /wc/i, /loo/i],
        response: () => `🚻 **Nearest Restrooms:**

1. **Level 1, East Wing** — 1 min walk ➡️
   👥 Current occupancy: 60% | Wait: ~1 min

2. **Level 2, Section 200 corridor** — 2 min walk ⬆️
   👥 Current occupancy: 35% | ✨ *Recommended — least crowded!*

3. **VIP Lounge area** — 3 min walk
   👥 Current occupancy: 20% *(VIP ticket holders only)*

♿ **Accessible restrooms** available at all locations (ground floor).
👶 **Family restrooms** with baby changing at East & West Wings.`
    },
    exit: {
        patterns: [/exit/i, /leave/i, /way out/i, /emergency/i, /evacuate/i],
        response: () => `🚪 **Exit Routes:**

📍 **Nearest Exit: East Gate (Gate B)** — 2 min walk
→ Follow the illuminated green EXIT signs along the concourse

📍 **Alternative Exits:**
• **Gate A** (North) — 4 min walk | Density: 🟢 Low
• **Gate D** (South) — 3 min walk | Density: 🟡 Medium
• **Gate C** (West) — 5 min walk | Density: 🔴 High — avoid if possible

⚡ **Emergency evacuation** routes are marked with red strobe lights.
🅿️ Gate A is closest to **Parking Lot 1 & Metro Station**.

💡 *AI recommends Gate A for the fastest post-match departure.*`
    },
    accessibility: {
        patterns: [/wheelchair/i, /accessible/i, /disability/i, /disabled/i, /mobility/i, /blind/i, /deaf/i, /accessibility/i],
        response: () => `♿ **Accessibility Information:**

🦽 **Wheelchair Routes:**
• All concourse levels connected by **elevators** (Zones A, D, F, J)
• Ramp access at every gate entrance
• Dedicated wheelchair seating in Sections 104, 118, 204, 318

👁️ **Visual Impairment:**
• Audio description service available on FM 94.5
• Tactile guide maps at all information desks

🦻 **Hearing Impairment:**
• Live captions on all stadium screens
• Sign language interpreters at Gates A & D

🏥 **Medical Assistance:** Press the red button on any accessibility station or ask AURA for immediate help.

📞 **Accessibility Hotline:** Dial 2026 on your mobile in-stadium.`
    },
    metro: {
        patterns: [/metro/i, /train/i, /subway/i, /transit/i, /bus/i, /transport/i, /get.*home/i, /uber/i, /taxi/i, /cab/i],
        response: () => `🚇 **Getting to the Metro Station:**

📍 **Meadowlands Station** — 8 min walk from Gate A (North Exit)
→ Turn left from Gate A → follow the covered walkway → station entrance on your right

🕐 **Next departures:**
• NJ Transit to **NYC Penn Station**: 3 min ⏱️
• NJ Transit to **Hoboken**: 8 min ⏱️
• Express to **Newark Airport**: 15 min ⏱️

🚕 **Rideshare (Uber/Lyft):**
• Pickup zone: **Lot K** (5 min walk from Gate D)
• Current wait: ~8 min | Surge: 1.4x

🚌 **Shuttle Buses:**
• Free FIFA shuttle to Times Square: every 10 min
• Runs until 2 hours after final whistle

💡 *NJ Transit is the fastest option. Platform 2 for NYC-bound.*`
    },
    score: {
        patterns: [/score/i, /result/i, /winning/i, /goal/i, /who.*lead/i, /match.*update/i],
        response: () => `⚽ **Live Match Update:**

🇧🇷 **Brazil 1 — 1 Argentina** 🇦🇷
🕐 62nd minute | 🏟️ MetLife Stadium

⚽ **Goals:**
• 34' — Vinícius Jr. (BRA) | Free kick, top corner
• 58' — Julián Álvarez (ARG) | Assist: Messi

📊 **Match Stats:**
• Possession: 🇧🇷 52% | 🇦🇷 48%
• Shots on target: 5 — 4
• Corners: 7 — 5

🟨 **Cards:** 2 yellow (1 each)
📺 *Next key moment predicted by AI: High press from Argentina expected in next 5 min*`
    },
    default: {
        response: (q) => `I appreciate your question! Let me help you with that.

🤖 As AURA, I can assist you with:

• 🪑 **Finding your seat** — "Where is Section 204?"
• 🍔 **Food & drinks** — "Best halal food nearby?"
• 🚻 **Restrooms** — "Nearest restroom?"
• 🚪 **Exit routes** — "How do I exit?"
• ♿ **Accessibility** — "Wheelchair routes?"
• 🚇 **Transport** — "How to get to the metro?"
• ⚽ **Match updates** — "What's the score?"

Try asking me one of these, or anything else about your stadium experience! I'm here to help in 20+ languages. 🌍`
    }
};

function getAIResponse(query) {
    for (const [key, data] of Object.entries(chatResponses)) {
        if (key === 'default') continue;
        if (data.patterns && data.patterns.some(p => p.test(query))) {
            return data.response(query);
        }
    }
    return chatResponses.default.response(query);
}

function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function addChatMessage(text, isUser = false) {
    const container = document.getElementById('chat-messages');
    const welcome = container.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

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

function handleChatSend() {
    const input = document.getElementById('chat-input');
    const query = input.value.trim();
    if (!query) return;

    addChatMessage(query, true);
    input.value = '';

    // Typing indicator
    const container = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-msg';
    typingDiv.innerHTML = `
        <div class="message-avatar">AI</div>
        <div><div class="message-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
        const typing = document.getElementById('typing-msg');
        if (typing) typing.remove();
        const response = getAIResponse(query);
        addChatMessage(response);
    }, 800 + Math.random() * 700);
}

function initChat() {
    document.getElementById('send-btn').addEventListener('click', handleChatSend);
    document.getElementById('chat-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') handleChatSend();
    });

    // Quick chips
    document.querySelectorAll('.quick-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.getElementById('chat-input').value = chip.dataset.query;
            // Switch to chat view
            document.querySelector('[data-view="chat"]').click();
            setTimeout(handleChatSend, 100);
        });
    });

    // Voice input
    const voiceBtn = document.getElementById('voice-btn');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            document.getElementById('chat-input').value = text;
            voiceBtn.classList.remove('listening');
            state.isListening = false;
            handleChatSend();
        };

        recognition.onerror = () => {
            voiceBtn.classList.remove('listening');
            state.isListening = false;
        };

        recognition.onend = () => {
            voiceBtn.classList.remove('listening');
            state.isListening = false;
        };

        voiceBtn.addEventListener('click', () => {
            if (state.isListening) {
                recognition.stop();
            } else {
                recognition.start();
                voiceBtn.classList.add('listening');
                state.isListening = true;
            }
        });
    } else {
        voiceBtn.style.opacity = '0.3';
        voiceBtn.title = 'Voice input not supported in this browser';
    }
}

// ── Navigator: Zone Colors & Tooltips ──
function initNavigator() {
    const zones = document.querySelectorAll('.stadium-zone');
    const tooltip = document.getElementById('zone-tooltip');

    function getDensityColor(pct) {
        if (pct < 50) return { fill: 'rgba(0,230,118,0.25)', stroke: 'rgba(0,230,118,0.5)', label: 'Low' };
        if (pct < 70) return { fill: 'rgba(255,171,0,0.25)', stroke: 'rgba(255,171,0,0.5)', label: 'Medium' };
        if (pct < 85) return { fill: 'rgba(255,107,53,0.3)', stroke: 'rgba(255,107,53,0.5)', label: 'High' };
        return { fill: 'rgba(255,82,82,0.35)', stroke: 'rgba(255,82,82,0.6)', label: 'Critical' };
    }

    function updateZoneColors() {
        zones.forEach(zone => {
            const density = parseInt(zone.dataset.density);
            const colors = getDensityColor(density);
            zone.style.fill = colors.fill;
            zone.style.stroke = colors.stroke;
        });
    }
    updateZoneColors();

    // Tooltip
    zones.forEach(zone => {
        zone.addEventListener('mouseenter', (e) => {
            const density = zone.dataset.density;
            const zoneId = zone.dataset.zone;
            const colors = getDensityColor(parseInt(density));
            tooltip.innerHTML = `<strong>Zone ${zoneId}</strong><br>Density: ${density}% (${colors.label})<br>Capacity: ~6,000 seats`;
            tooltip.classList.add('visible');
        });

        zone.addEventListener('mousemove', (e) => {
            const mapArea = document.querySelector('.map-area');
            const rect = mapArea.getBoundingClientRect();
            tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
            tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
        });

        zone.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            document.querySelectorAll('.poi-group').forEach(g => {
                if (filter === 'density') {
                    g.classList.remove('hidden');
                } else {
                    g.classList.toggle('hidden', g.dataset.type !== filter);
                }
            });
        });
    });

    // POI list
    const poiList = document.getElementById('poi-list');
    const pois = [
        { icon: '🍔', name: 'Stadium Grill — Zone D', type: 'food' },
        { icon: '🍕', name: 'Pizza Corner — Zone E', type: 'food' },
        { icon: '🌮', name: 'Taco Fiesta — Zone J', type: 'food' },
        { icon: '🚻', name: 'Restroom — Zone B', type: 'restroom' },
        { icon: '🚻', name: 'Restroom — Zone J', type: 'restroom' },
        { icon: '🏥', name: 'First Aid — Zone D', type: 'medical' },
        { icon: '🏥', name: 'First Aid — Zone E', type: 'medical' },
        { icon: '🚪', name: 'Exit — Gate A (North)', type: 'exit' },
        { icon: '🚪', name: 'Exit — Gate D (South)', type: 'exit' },
    ];

    poiList.innerHTML = pois.map(p => `
        <div class="poi-item" data-type="${p.type}">
            <span>${p.icon}</span>
            <span>${p.name}</span>
        </div>
    `).join('');

    // Live density updates
    setInterval(() => {
        zones.forEach(zone => {
            let d = parseInt(zone.dataset.density);
            d = Math.max(15, Math.min(98, d + Math.round((Math.random() - 0.5) * 5)));
            zone.dataset.density = d;
        });
        updateZoneColors();
    }, 6000);
}

// ── Operations: Incident Feed ──
function initOperations() {
    const incidentsList = document.getElementById('incidents-list');
    const predictionsList = document.getElementById('predictions-list');
    const decisionCards = document.getElementById('decision-cards');
    const resourceGrid = document.getElementById('resource-grid');
    const staffBody = document.getElementById('staff-table-body');

    // Incidents
    const incidents = [
        { type: '🚨 Medical Alert', status: 'active', summary: 'AI Summary: Fan in Section 118 reported dizziness. Medical team dispatched. Vitals being monitored. Heat-related — water distributed to surrounding rows.', zone: 'Zone B', time: '3 min ago' },
        { type: '⚠️ Crowd Surge', status: 'critical', summary: 'AI Summary: Zone G experiencing 93% density. Crowd flow algorithm activated. Staff redirecting fans via South concourse. ETA to resolve: 8 minutes.', zone: 'Zone G', time: '7 min ago' },
        { type: '✅ Gate Malfunction', status: 'resolved', summary: 'AI Summary: Gate C scanner #3 experienced intermittent failure. Backup scanner activated within 30 seconds. No significant queue buildup. Root cause: firmware update needed.', zone: 'Gate C', time: '22 min ago' },
    ];

    incidentsList.innerHTML = incidents.map(inc => `
        <div class="incident-item ${inc.status}">
            <div class="incident-header">
                <span class="incident-type">${inc.type}</span>
                <span class="incident-status ${inc.status}">${inc.status.toUpperCase()}</span>
            </div>
            <div class="incident-summary">${inc.summary}</div>
            <div class="incident-meta">
                <span>📍 ${inc.zone}</span>
                <span>🕐 ${inc.time}</span>
            </div>
        </div>
    `).join('');

    // Predictions
    const predictions = [
        { title: '🌊 Crowd Surge Predicted — Zone E', desc: 'Based on historical patterns and current flow rates, Zone E will reach 90% density in approximately 12 minutes if no action is taken.', confidence: '87%', action: 'Deploy 4 Staff to Zone E' },
        { title: '🚗 Traffic Spike — Post-Match', desc: 'AI models predict a 3x traffic increase on Route 3 within 5 minutes of final whistle. Pre-positioning traffic officers recommended.', confidence: '92%', action: 'Alert Traffic Control' },
        { title: '🍔 Food Shortage — Zone B', desc: 'Beverage inventory in Zone B vendors projected to deplete in 25 minutes at current consumption rate. Resupply recommended now.', confidence: '78%', action: 'Trigger Resupply' },
    ];

    predictionsList.innerHTML = predictions.map(p => `
        <div class="prediction-item">
            <div class="prediction-header">
                <span class="prediction-title">${p.title}</span>
                <span class="prediction-confidence">${p.confidence} confidence</span>
            </div>
            <div class="prediction-desc">${p.desc}</div>
            <button class="prediction-action">⚡ ${p.action}</button>
        </div>
    `).join('');

    // Decision Support
    const decisions = [
        { title: '🔄 Reroute Zone G Fans', desc: 'AI recommends opening auxiliary corridor 3 to relieve Zone G congestion. This would reduce density by an estimated 15% within 5 minutes.', primary: 'Approve Reroute', secondary: 'Dismiss' },
        { title: '📢 Half-time Announcement', desc: 'AI-generated announcement ready for broadcast: Safety reminders, food court locations, and accessibility information in 4 languages.', primary: 'Send Broadcast', secondary: 'Edit' },
    ];

    decisionCards.innerHTML = decisions.map(d => `
        <div class="decision-card">
            <h4>${d.title}</h4>
            <p>${d.desc}</p>
            <div class="decision-actions">
                <button class="btn-primary">${d.primary}</button>
                <button class="btn-secondary">${d.secondary}</button>
            </div>
        </div>
    `).join('');

    // Resources
    const resources = [
        { icon: '🏥', name: 'Medical Kits', value: '24/30', pct: 80, color: '#00e676' },
        { icon: '🚧', name: 'Barriers', value: '45/50', pct: 90, color: '#00d4ff' },
        { icon: '💧', name: 'Water Stations', value: '18/20', pct: 90, color: '#448aff' },
        { icon: '📻', name: 'Radios', value: '92/100', pct: 92, color: '#f5a623' },
    ];

    resourceGrid.innerHTML = resources.map(r => `
        <div class="resource-item">
            <div class="resource-icon">${r.icon}</div>
            <div class="resource-name">${r.name}</div>
            <div class="resource-value" style="color:${r.color}">${r.value}</div>
            <div class="resource-bar">
                <div class="resource-bar-fill" style="width:${r.pct}%;background:${r.color}"></div>
            </div>
        </div>
    `).join('');

    // Staff
    const staff = [
        { team: 'Security Alpha', zone: 'Zone A-C', count: 24, status: 'active', statusLabel: 'Active' },
        { team: 'Security Bravo', zone: 'Zone D-F', count: 18, status: 'active', statusLabel: 'Active' },
        { team: 'Medical Team 1', zone: 'Zone B', count: 6, status: 'deployed', statusLabel: 'Deployed' },
        { team: 'Medical Team 2', zone: 'Standby', count: 4, status: 'standby', statusLabel: 'Standby' },
        { team: 'Crowd Control', zone: 'Zone G', count: 12, status: 'deployed', statusLabel: 'Deployed' },
        { team: 'Maintenance', zone: 'All Zones', count: 8, status: 'active', statusLabel: 'Active' },
    ];

    staffBody.innerHTML = staff.map(s => `
        <tr>
            <td>${s.team}</td>
            <td>${s.zone}</td>
            <td>${s.count}</td>
            <td><span class="status-dot ${s.status}"></span>${s.statusLabel}</td>
        </tr>
    `).join('');

    // Broadcast send
    document.getElementById('broadcast-send').addEventListener('click', () => {
        const msg = document.getElementById('broadcast-message').value.trim();
        if (msg) {
            showToast('success', 'Broadcast Sent', `Message sent to ${document.getElementById('broadcast-target').value}`);
            document.getElementById('broadcast-message').value = '';
        }
    });

    // Prediction actions
    document.querySelectorAll('.prediction-action').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('info', 'Action Triggered', btn.textContent.trim());
            btn.textContent = '✅ Executed';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.5';
        });
    });

    // Decision buttons
    decisionCards.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('success', 'Decision Approved', btn.textContent);
            const card = btn.closest('.decision-card');
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        });
    });
}

// ── Transport View ──
function initTransport() {
    // Traffic routes
    const trafficContainer = document.getElementById('traffic-routes');
    const routes = [
        { name: 'Route 3 East', status: 'Heavy traffic — 25 min delay', time: '35 min', icon: '🔴', bg: 'rgba(255,82,82,0.1)' },
        { name: 'NJ Turnpike South', status: 'Moderate — 10 min delay', time: '22 min', icon: '🟡', bg: 'rgba(255,171,0,0.1)' },
        { name: 'Route 120', status: 'Clear — no delays', time: '12 min', icon: '🟢', bg: 'rgba(0,230,118,0.1)' },
        { name: 'I-95 North', status: 'Moderate — 8 min delay', time: '18 min', icon: '🟡', bg: 'rgba(255,171,0,0.1)' },
    ];

    trafficContainer.innerHTML = routes.map(r => `
        <div class="traffic-route">
            <div class="traffic-indicator" style="background:${r.bg}">${r.icon}</div>
            <div class="traffic-details">
                <div class="traffic-name">${r.name}</div>
                <div class="traffic-status">${r.status}</div>
            </div>
            <div class="traffic-time">${r.time}</div>
        </div>
    `).join('');

    // Parking
    const parkingContainer = document.getElementById('parking-lots');
    const lots = [
        { name: 'Lot A', pct: 92, color: '#ff5252' },
        { name: 'Lot B', pct: 78, color: '#ff6b35' },
        { name: 'Lot C', pct: 55, color: '#ffab00' },
        { name: 'Lot D', pct: 33, color: '#00e676' },
        { name: 'Lot K', pct: 88, color: '#ff5252' },
    ];

    parkingContainer.innerHTML = lots.map(l => `
        <div class="parking-lot">
            <span class="parking-name">${l.name}</span>
            <div class="parking-bar">
                <div class="parking-fill" style="width:${l.pct}%;background:linear-gradient(90deg,${l.color}88,${l.color})"></div>
            </div>
            <span class="parking-pct" style="color:${l.color}">${l.pct}%</span>
        </div>
    `).join('');

    // Transit Schedule
    const transitContainer = document.getElementById('transit-schedule');
    const transit = [
        { mode: '🚇', name: 'NJ Transit to NYC Penn', next: 'Platform 2', countdown: '3 min', color: '#00e676' },
        { mode: '🚇', name: 'NJ Transit to Hoboken', next: 'Platform 4', countdown: '8 min', color: '#00d4ff' },
        { mode: '🚌', name: 'FIFA Shuttle — Times Square', next: 'Bay C', countdown: '2 min', color: '#00e676' },
        { mode: '🚌', name: 'FIFA Shuttle — Newark Airport', next: 'Bay A', countdown: '12 min', color: '#ffab00' },
        { mode: '🚍', name: 'NJ Transit Bus 160', next: 'Stop 3', countdown: '6 min', color: '#00d4ff' },
    ];

    transitContainer.innerHTML = transit.map(t => `
        <div class="transit-item">
            <span class="transit-mode">${t.mode}</span>
            <div class="transit-info">
                <div class="transit-name">${t.name}</div>
                <div class="transit-next">${t.next}</div>
            </div>
            <span class="transit-countdown" style="color:${t.color}">${t.countdown}</span>
        </div>
    `).join('');

    // Carbon modes
    const carbonContainer = document.getElementById('carbon-modes');
    const modes = [
        { icon: '🚇', name: 'Public Transit', value: '0.04 kg CO₂/fan', pct: 10, color: '#00e676' },
        { icon: '🚌', name: 'Shuttle Bus', value: '0.08 kg CO₂/fan', pct: 20, color: '#00d4ff' },
        { icon: '🚗', name: 'Personal Car', value: '0.52 kg CO₂/fan', pct: 65, color: '#ff6b35' },
        { icon: '🚕', name: 'Rideshare', value: '0.31 kg CO₂/fan', pct: 40, color: '#ffab00' },
        { icon: '🚲', name: 'Bike / Walk', value: '0.00 kg CO₂/fan', pct: 0, color: '#00e676' },
    ];

    carbonContainer.innerHTML = modes.map(m => `
        <div class="carbon-mode">
            <span class="carbon-mode-icon">${m.icon}</span>
            <div class="carbon-mode-info">
                <div class="carbon-mode-name">${m.name}</div>
                <div class="carbon-mode-bar">
                    <div class="carbon-mode-fill" style="width:${m.pct}%;background:${m.color}"></div>
                </div>
            </div>
            <span class="carbon-mode-value" style="color:${m.color}">${m.value}</span>
        </div>
    `).join('');

    // Rideshare
    const rideshareContainer = document.getElementById('rideshare-status');
    const rideshare = [
        { name: 'Uber', count: 142, wait: 'Avg wait: 8 min', color: '#00d4ff' },
        { name: 'Lyft', count: 87, wait: 'Avg wait: 11 min', color: '#ec4899' },
        { name: 'FIFA Official', count: 35, wait: 'Avg wait: 3 min', color: '#f5a623' },
    ];

    rideshareContainer.innerHTML = rideshare.map(r => `
        <div class="rideshare-item">
            <div>
                <div class="rideshare-name">${r.name}</div>
                <div class="rideshare-wait">${r.wait}</div>
            </div>
            <span class="rideshare-count" style="color:${r.color}">${r.count} vehicles</span>
        </div>
    `).join('');

    // Departure chart
    initDepartureChart();

    // Departure summary
    document.getElementById('departure-summary').innerHTML =
        '🤖 <strong>AI Prediction:</strong> Peak departure wave expected at <strong>final whistle + 4 min</strong>. Recommend pre-positioning 8 additional traffic officers on Route 3 and increasing shuttle frequency to 5-minute intervals starting at the 85th minute.';
}

function initDepartureChart() {
    const canvas = document.getElementById('departure-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const data = [];
    for (let i = 0; i < 30; i++) {
        const minute = i * 2;
        let fans;
        if (minute < 10) fans = Math.random() * 500;
        else if (minute < 16) fans = 2000 + Math.random() * 3000 + (minute - 10) * 2000;
        else if (minute < 24) fans = 18000 - (minute - 16) * 1500 + Math.random() * 2000;
        else fans = 3000 - minute * 50 + Math.random() * 500;
        data.push({ minute: `+${minute}m`, fans: Math.max(0, fans) });
    }

    function draw() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const w = rect.width;
        const h = rect.height;
        const pad = { top: 20, right: 20, bottom: 30, left: 55 };
        const plotW = w - pad.left - pad.right;
        const plotH = h - pad.top - pad.bottom;
        const maxVal = Math.max(...data.map(d => d.fans));

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad.top + (plotH / 4) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
            ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
            ctx.font = '10px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round((maxVal / 4) * (4 - i)).toLocaleString(), pad.left - 8, y + 4);
        }

        // Labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.textAlign = 'center';
        for (let i = 0; i < data.length; i += 5) {
            const x = pad.left + (i / (data.length - 1)) * plotW;
            ctx.fillText(data[i].minute, x, h - 8);
        }

        // Bars
        const barW = (plotW / data.length) * 0.7;
        data.forEach((d, i) => {
            const x = pad.left + (i / (data.length - 1)) * plotW - barW / 2;
            const barH = (d.fans / maxVal) * plotH;
            const y = pad.top + plotH - barH;

            const grad = ctx.createLinearGradient(0, y, 0, pad.top + plotH);
            grad.addColorStop(0, 'rgba(245, 166, 35, 0.8)');
            grad.addColorStop(1, 'rgba(245, 166, 35, 0.2)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]);
            ctx.fill();
        });
    }

    draw();
    window.addEventListener('resize', draw);
}

// ── Sustainability View ──
function initSustainability() {
    // Score circle
    drawScoreCircle();

    // Energy chart
    initEnergyChart();

    // Energy stats
    const energyStats = document.getElementById('energy-stats');
    energyStats.innerHTML = `
        <div class="energy-stat">
            <div class="energy-stat-value">1,240 kWh</div>
            <div class="energy-stat-label">Current Load</div>
        </div>
        <div class="energy-stat">
            <div class="energy-stat-value" style="color:#00e676">32%</div>
            <div class="energy-stat-label">Solar Powered</div>
        </div>
        <div class="energy-stat">
            <div class="energy-stat-value" style="color:#00d4ff">-8%</div>
            <div class="energy-stat-label">vs. Last Match</div>
        </div>
    `;

    // Waste
    const wasteContainer = document.getElementById('waste-categories');
    const waste = [
        { icon: '♻️', name: 'Recyclables', pct: 78, color: '#00e676' },
        { icon: '🗑️', name: 'General Waste', pct: 45, color: '#ff6b35' },
        { icon: '🥤', name: 'Compostable', pct: 62, color: '#ffab00' },
        { icon: '🧴', name: 'Plastics', pct: 85, color: '#00d4ff' },
    ];

    wasteContainer.innerHTML = waste.map(w => `
        <div class="waste-item">
            <span class="waste-icon">${w.icon}</span>
            <div class="waste-info">
                <div class="waste-name">${w.name}</div>
                <div class="waste-bar">
                    <div class="waste-fill" style="width:${w.pct}%;background:${w.color}"></div>
                </div>
            </div>
            <span class="waste-pct" style="color:${w.color}">${w.pct}%</span>
        </div>
    `).join('');

    // Water
    const waterContainer = document.getElementById('water-stats');
    const water = [
        { icon: '💧', label: 'Total Consumption', value: '12,400 L' },
        { icon: '🔄', label: 'Recycled Water', value: '4,200 L' },
        { icon: '🚿', label: 'Saved vs Target', value: '-15%' },
    ];

    waterContainer.innerHTML = water.map(w => `
        <div class="water-item">
            <span class="water-icon">${w.icon}</span>
            <div class="water-info">
                <div class="water-label">${w.label}</div>
                <div class="water-value">${w.value}</div>
            </div>
        </div>
    `).join('');

    // AI Recommendations
    const recContainer = document.getElementById('ai-recommendations');
    const recs = [
        { icon: '💡', title: 'Dim Zone D Lights', desc: 'Zone D is at 45% density. Reducing lighting by 30% would save 180 kWh with no fan impact.', impact: 'Save 180 kWh' },
        { icon: '❄️', title: 'HVAC Optimization', desc: 'Temperature dropped 2°C. AI recommends reducing cooling in Zones A, H, J by 20%.', impact: 'Save 240 kWh' },
        { icon: '🗑️', title: 'Deploy Waste Team', desc: 'Bin sensors show Zone G bins at 85% capacity. Deploy collection team now to prevent overflow.', impact: 'Prevent overflow' },
    ];

    recContainer.innerHTML = recs.map(r => `
        <div class="ai-rec">
            <div class="ai-rec-icon">${r.icon}</div>
            <div class="ai-rec-title">${r.title}</div>
            <div class="ai-rec-desc">${r.desc}</div>
            <div class="ai-rec-impact">⚡ ${r.impact}</div>
        </div>
    `).join('');

    // Carbon chart
    initCarbonChart();
}

function drawScoreCircle() {
    const canvas = document.getElementById('sustain-score-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 200;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const center = size / 2;
    const radius = 80;
    const lineWidth = 10;
    const score = 87;

    // Background arc
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Score arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (score / 100) * Math.PI * 2;
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#00e676');
    gradient.addColorStop(1, '#00d4ff');

    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Glow
    ctx.shadowColor = '#00e676';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function initEnergyChart() {
    const canvas = document.getElementById('energy-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const data = [];
    for (let i = 0; i < 24; i++) {
        const hour = i;
        const base = hour >= 14 && hour <= 22
            ? 800 + Math.sin((hour - 14) / 8 * Math.PI) * 500
            : 200 + Math.random() * 100;
        data.push({ hour: `${String(hour).padStart(2, '0')}:00`, value: base + Math.random() * 100 });
    }

    function draw() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const w = rect.width;
        const h = rect.height;
        const pad = { top: 15, right: 15, bottom: 25, left: 45 };
        const plotW = w - pad.left - pad.right;
        const plotH = h - pad.top - pad.bottom;
        const maxVal = Math.max(...data.map(d => d.value));

        ctx.clearRect(0, 0, w, h);

        // Area
        const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
        grad.addColorStop(0, 'rgba(245, 166, 35, 0.3)');
        grad.addColorStop(1, 'rgba(245, 166, 35, 0.02)');

        ctx.beginPath();
        ctx.moveTo(pad.left, h - pad.bottom);
        data.forEach((d, i) => {
            const x = pad.left + (i / (data.length - 1)) * plotW;
            const y = pad.top + (1 - d.value / maxVal) * plotH;
            if (i === 0) ctx.lineTo(x, y);
            else {
                const px = pad.left + ((i - 1) / (data.length - 1)) * plotW;
                const py = pad.top + (1 - data[i - 1].value / maxVal) * plotH;
                ctx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
            }
        });
        ctx.lineTo(pad.left + plotW, h - pad.bottom);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        data.forEach((d, i) => {
            const x = pad.left + (i / (data.length - 1)) * plotW;
            const y = pad.top + (1 - d.value / maxVal) * plotH;
            if (i === 0) ctx.moveTo(x, y);
            else {
                const px = pad.left + ((i - 1) / (data.length - 1)) * plotW;
                const py = pad.top + (1 - data[i - 1].value / maxVal) * plotH;
                ctx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
            }
        });
        ctx.strokeStyle = '#f5a623';
        ctx.lineWidth = 2;
        ctx.stroke();

        // X labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = '9px Inter';
        ctx.textAlign = 'center';
        for (let i = 0; i < data.length; i += 4) {
            const x = pad.left + (i / (data.length - 1)) * plotW;
            ctx.fillText(data[i].hour, x, h - 6);
        }
    }

    draw();
    window.addEventListener('resize', draw);
}

function initCarbonChart() {
    const canvas = document.getElementById('carbon-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const days = ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 'Today'];
    const emissions = [42, 38, 35, 33, 31, 28];

    function draw() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const w = rect.width;
        const h = rect.height;
        const pad = { top: 20, right: 20, bottom: 30, left: 45 };
        const plotW = w - pad.left - pad.right;
        const plotH = h - pad.top - pad.bottom;
        const maxVal = Math.max(...emissions) * 1.1;

        ctx.clearRect(0, 0, w, h);

        const barW = (plotW / days.length) * 0.6;
        const gap = (plotW / days.length) * 0.4;

        days.forEach((day, i) => {
            const x = pad.left + (i / days.length) * plotW + gap / 2;
            const barH = (emissions[i] / maxVal) * plotH;
            const y = pad.top + plotH - barH;

            const grad = ctx.createLinearGradient(0, y, 0, pad.top + plotH);
            const isToday = i === days.length - 1;
            grad.addColorStop(0, isToday ? 'rgba(0, 230, 118, 0.9)' : 'rgba(0, 212, 255, 0.6)');
            grad.addColorStop(1, isToday ? 'rgba(0, 230, 118, 0.2)' : 'rgba(0, 212, 255, 0.1)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
            ctx.fill();

            // Value
            ctx.fillStyle = 'rgba(240, 244, 248, 0.7)';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${emissions[i]}t`, x + barW / 2, y - 6);

            // Label
            ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
            ctx.font = '9px Inter';
            ctx.fillText(day, x + barW / 2, h - 8);
        });

        // Trend line
        ctx.beginPath();
        days.forEach((_, i) => {
            const x = pad.left + (i / days.length) * plotW + gap / 2 + barW / 2;
            const y = pad.top + (1 - emissions[i] / maxVal) * plotH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = 'rgba(0, 230, 118, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    draw();
    window.addEventListener('resize', draw);
}

// ── Toast Notifications ──
function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    const icons = { info: 'ℹ️', warning: '⚠️', danger: '🚨', success: '✅' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ── Periodic Notifications ──
function initNotifications() {
    const notifications = [
        { type: 'info', title: 'AI Insight', msg: 'Fan sentiment analysis: 92% positive based on social media feeds' },
        { type: 'warning', title: 'Crowd Alert', msg: 'Zone E approaching 85% density — monitoring closely' },
        { type: 'success', title: 'System Update', msg: 'All 24 CCTV feeds processing normally. CV models at 99.2% accuracy' },
        { type: 'info', title: 'Transport Update', msg: 'NJ Transit has added 2 extra services for post-match departures' },
        { type: 'success', title: 'Sustainability', msg: 'Stadium is on track to beat recycling target by 12%' },
    ];

    let idx = 0;
    setInterval(() => {
        const n = notifications[idx % notifications.length];
        showToast(n.type, n.title, n.msg);
        idx++;

        // Update notification count
        const countEl = document.getElementById('notification-count');
        countEl.textContent = parseInt(countEl.textContent) + 1;
    }, 25000);
}

// ── Initialize Everything ──
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    initClock();

    // Dashboard
    initFanFlowChart();
    initGateBars();
    initZoneGrid();
    initAISummary();
    initAlerts();
    initKPIUpdates();

    // Chat
    initChat();

    // Navigator
    initNavigator();

    // Operations
    initOperations();

    // Transport
    initTransport();

    // Sustainability
    initSustainability();

    // Notifications
    initNotifications();

    // Initial welcome toast
    setTimeout(() => {
        showToast('info', 'Welcome to AURA', 'AI Unified Real-time Assistant is online. All systems operational.');
    }, 1500);
});
