/* =============================================
   AURA – Transport View
   Traffic, parking, transit, departure prediction
   ============================================= */

import { TRAFFIC_ROUTES, PARKING_LOTS, TRANSIT_SCHEDULE, CARBON_MODES, RIDESHARE_DATA } from '../config.js';
import { BarChart } from '../charts/BarChart.js';

let departureChart = null;

export function init() {
    renderTraffic();
    renderParking();
    renderTransit();
    renderCarbonModes();
    renderRideshare();
    renderDepartureSummary();
    initDepartureChart();
}

export function enter() {
    // Redraw chart that may have been hidden
    if (departureChart) departureChart.draw();
    return [];
}

function renderTraffic() {
    const el = document.getElementById('traffic-routes');
    if (!el) return;
    el.innerHTML = TRAFFIC_ROUTES.map(r => `
        <div class="traffic-route">
            <div class="traffic-indicator" style="background:${r.bg}">${r.icon}</div>
            <div class="traffic-details">
                <div class="traffic-name">${r.name}</div>
                <div class="traffic-status">${r.status}</div>
            </div>
            <div class="traffic-time">${r.time}</div>
        </div>
    `).join('');
}

function renderParking() {
    const el = document.getElementById('parking-lots');
    if (!el) return;
    el.innerHTML = PARKING_LOTS.map(l => `
        <div class="parking-lot">
            <span class="parking-name">${l.name}</span>
            <div class="parking-bar">
                <div class="parking-fill" style="width:${l.pct}%;background:linear-gradient(90deg,${l.color}88,${l.color})"></div>
            </div>
            <span class="parking-pct" style="color:${l.color}">${l.pct}%</span>
        </div>
    `).join('');
}

function renderTransit() {
    const el = document.getElementById('transit-schedule');
    if (!el) return;
    el.innerHTML = TRANSIT_SCHEDULE.map(t => `
        <div class="transit-item">
            <span class="transit-mode">${t.mode}</span>
            <div class="transit-info">
                <div class="transit-name">${t.name}</div>
                <div class="transit-next">${t.next}</div>
            </div>
            <span class="transit-countdown" style="color:${t.color}">${t.countdown}</span>
        </div>
    `).join('');
}

// ── Carbon Modes ──
function renderCarbonModes() {
    const el = document.getElementById('carbon-modes');
    if (!el) return;
    el.innerHTML = CARBON_MODES.map(m => `
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
}

function renderRideshare() {
    const el = document.getElementById('rideshare-status');
    if (!el) return;
    el.innerHTML = RIDESHARE_DATA.map(r => `
        <div class="rideshare-item">
            <div>
                <div class="rideshare-name">${r.name}</div>
                <div class="rideshare-wait">${r.wait}</div>
            </div>
            <span class="rideshare-count" style="color:${r.color}">${r.count} vehicles</span>
        </div>
    `).join('');
}

function renderDepartureSummary() {
    const el = document.getElementById('departure-summary');
    if (el) {
        el.innerHTML = '🤖 <strong>AI Prediction:</strong> Peak departure wave expected at <strong>final whistle + 4 min</strong>. Recommend pre-positioning 8 additional traffic officers on Route 3 and increasing shuttle frequency to 5-minute intervals starting at the 85th minute.';
    }
}

function initDepartureChart() {
    departureChart = new BarChart('departure-chart', {
        barWidthRatio: 0.7,
    });
    departureChart.startResizeListener();

    const data = [];
    for (let i = 0; i < 30; i++) {
        const minute = i * 2;
        let fans;
        if (minute < 10) fans = Math.random() * 500;
        else if (minute < 16) fans = 2000 + Math.random() * 3000 + (minute - 10) * 2000;
        else if (minute < 24) fans = 18000 - (minute - 16) * 1500 + Math.random() * 2000;
        else fans = 3000 - minute * 50 + Math.random() * 500;
        data.push({ label: `+${minute}m`, value: Math.max(0, fans), valueLabel: '' });
    }
    departureChart.setData(data);
    departureChart.draw();
}
