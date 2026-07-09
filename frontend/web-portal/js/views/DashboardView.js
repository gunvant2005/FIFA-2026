/* =============================================
   AURA – Dashboard View (Production Config)
   Command Center with KPIs, charts, alerts
   ============================================= */

import { getState, setState } from '../state.js';
import { GATES, ALERTS, AI_SUMMARIES, STADIUM, INTERVALS } from '../config.js';
import { getDensityColor, clamp, createInterval } from '../utils.js';
import { AreaChart } from '../charts/AreaChart.js';

let fanFlowChart = null;
const BACKEND_URL = 'http://localhost:8000';

/** One-time DOM setup */
export function init() {
    renderGateBars();
    renderZoneGrid();
    renderAlerts();
    initFanFlowChart();
}

/** Called every time view becomes active. Returns cleanup fns. */
export function enter() {
    const cleanups = [];

    // Redraw chart (may have been hidden)
    if (fanFlowChart) fanFlowChart.draw();

    // Fetch and update dashboard metrics
    const fetchMetrics = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/metrics`);
            if (!res.ok) throw new Error("HTTP error");
            const data = await res.json();
            
            setState({
                fanCount: data.fanCount,
                crowdDensity: data.crowdDensity,
                activeIncidents: data.activeIncidents,
                transportArrivals: data.transportArrivals
            });

            document.getElementById('kpi-fans-value').textContent = data.fanCount.toLocaleString();
            document.getElementById('kpi-density-value').textContent = data.crowdDensity + '%';
            document.getElementById('kpi-transport-value').textContent = data.transportArrivals.toLocaleString();
            
            const incidentBadge = document.getElementById('kpi-incidents-value');
            if (incidentBadge) incidentBadge.textContent = data.activeIncidents;
        } catch (e) {
            // Graceful simulated fallback if server is offline
            const s = getState();
            let fans = clamp(s.fanCount + Math.round((Math.random() - 0.3) * 50), 50000, 82000);
            let density = clamp(s.crowdDensity + Math.round((Math.random() - 0.5) * 3), 40, 98);
            let transport = s.transportArrivals + Math.round(Math.random() * 80);
            
            setState({ fanCount: fans, crowdDensity: density, transportArrivals: transport });

            document.getElementById('kpi-fans-value').textContent = fans.toLocaleString();
            document.getElementById('kpi-density-value').textContent = density + '%';
            document.getElementById('kpi-transport-value').textContent = transport.toLocaleString();
        }
    };
    fetchMetrics();
    cleanups.push(createInterval(fetchMetrics, INTERVALS.kpiUpdate));

    // Live gate bar updates
    cleanups.push(createInterval(updateGateBars, INTERVALS.gateBars));

    // Live zone grid updates
    cleanups.push(createInterval(updateZoneGrid, INTERVALS.zoneGrid));

    // AI summary cycle
    let summaryIdx = 0;
    function showSummary() {
        const container = document.getElementById('ai-summary-content');
        if (!container) return;
        container.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        setTimeout(() => {
            container.innerHTML = AI_SUMMARIES[summaryIdx % AI_SUMMARIES.length];
            summaryIdx++;
        }, 1500);
    }
    showSummary();
    cleanups.push(createInterval(showSummary, INTERVALS.aiSummary));

    // Fan flow chart live update
    cleanups.push(createInterval(() => {
        const data = getState('fanFlowData');
        if (!data || data.length === 0) return;
        data.shift();
        const last = data[data.length - 1];
        const newVal = Math.max(5000, last.value + (Math.random() - 0.48) * 3000);
        const now = new Date();
        data.push({
            label: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
            value: newVal,
        });
        setState({ fanFlowData: data });
        if (fanFlowChart) {
            fanFlowChart.setData(data);
            fanFlowChart.draw();
        }
    }, INTERVALS.fanFlow));

    return cleanups;
}

// ── Fan Flow Chart ──
function initFanFlowChart() {
    fanFlowChart = new AreaChart('fan-flow-chart');
    fanFlowChart.startResizeListener();

    const dataPoints = 40;
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
        const hour = 14 + (i / dataPoints) * 5;
        const base = Math.sin((i / dataPoints) * Math.PI) * 60000 + 20000;
        data.push({
            label: `${Math.floor(hour)}:${String(Math.floor((hour % 1) * 60)).padStart(2, '0')}`,
            value: Math.max(0, base + (Math.random() - 0.5) * 8000),
        });
    }
    setState({ fanFlowData: data });
    fanFlowChart.setData(data);
    fanFlowChart.draw();
}

// ── Gate Bars ──
function renderGateBars() {
    const container = document.getElementById('gate-bars');
    if (!container) return;
    container.innerHTML = GATES.map(g => `
        <div class="gate-bar-item">
            <span class="gate-bar-label">${g.name}</span>
            <div class="gate-bar-track">
                <div class="gate-bar-fill" style="width:${g.throughput}%;background:linear-gradient(90deg,${g.color}88,${g.color})"></div>
            </div>
            <span class="gate-bar-value">${g.throughput}%</span>
        </div>
    `).join('');
}

function updateGateBars() {
    const items = document.querySelectorAll('#gate-bars .gate-bar-item');
    items.forEach(item => {
        const fill = item.querySelector('.gate-bar-fill');
        const val = item.querySelector('.gate-bar-value');
        const newVal = clamp(parseInt(val.textContent) + Math.round((Math.random() - 0.5) * 8), 20, 98);
        fill.style.width = newVal + '%';
        val.textContent = newVal + '%';
    });
}

// ── Zone Grid ──
const _zoneDensities = [...STADIUM.zoneDensities];

function renderZoneGrid() {
    const container = document.getElementById('zone-grid');
    if (!container) return;
    container.innerHTML = STADIUM.zones.map((z, i) => {
        const c = getDensityColor(_zoneDensities[i]);
        return `<div class="zone-cell" style="background:${c.bg};color:${c.text}">
            <span class="zone-name">${z}</span>
            <span class="zone-pct">${_zoneDensities[i]}%</span>
        </div>`;
    }).join('');
}

function updateZoneGrid() {
    _zoneDensities.forEach((d, i) => {
        _zoneDensities[i] = clamp(d + Math.round((Math.random() - 0.5) * 6), 15, 98);
    });
    renderZoneGrid();
}

// ── Alerts ──
function renderAlerts() {
    const container = document.getElementById('dashboard-alerts');
    if (!container) return;
    container.innerHTML = ALERTS.map(a => `
        <div class="alert-item ${a.type}">
            <span class="alert-icon">${a.icon}</span>
            <div class="alert-content">
                <div class="alert-text">${a.text}</div>
                <div class="alert-time">${a.time}</div>
            </div>
        </div>
    `).join('');
}
