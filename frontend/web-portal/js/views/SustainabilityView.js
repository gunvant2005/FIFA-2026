/* =============================================
   AURA – Sustainability View
   Energy, waste, water, carbon, AI recs
   ============================================= */

import { WASTE_CATEGORIES, WATER_STATS, AI_RECOMMENDATIONS } from '../config.js';
import { GaugeChart } from '../charts/GaugeChart.js';
import { AreaChart } from '../charts/AreaChart.js';
import { BarChart } from '../charts/BarChart.js';

let scoreGauge = null;
let energyChart = null;
let carbonChart = null;

export function init() {
    initScoreGauge();
    initEnergyChart();
    renderEnergyStats();
    renderWaste();
    renderWater();
    initCarbonChart();
    renderAIRecommendations();
}

export function enter() {
    // Redraw charts that may have been hidden
    if (scoreGauge) scoreGauge.draw();
    if (energyChart) energyChart.draw();
    if (carbonChart) carbonChart.draw();
    return [];
}

function initScoreGauge() {
    scoreGauge = new GaugeChart('sustain-score-canvas');
    scoreGauge.setValue(87);
    scoreGauge.draw();
}

function initEnergyChart() {
    energyChart = new AreaChart('energy-chart', {
        lineColor: '#f5a623',
        fillColorTop: 'rgba(245, 166, 35, 0.3)',
        fillColorBottom: 'rgba(245, 166, 35, 0.02)',
        showDot: false,
        padding: { top: 15, right: 15, bottom: 25, left: 45 },
    });
    energyChart.startResizeListener();

    const data = [];
    for (let i = 0; i < 24; i++) {
        const base = i >= 14 && i <= 22
            ? 800 + Math.sin((i - 14) / 8 * Math.PI) * 500
            : 200 + Math.random() * 100;
        data.push({ label: `${String(i).padStart(2, '0')}:00`, value: base + Math.random() * 100 });
    }
    energyChart.setData(data);
    energyChart.draw();
}

function renderEnergyStats() {
    const el = document.getElementById('energy-stats');
    if (!el) return;
    el.innerHTML = `
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
}

function renderWaste() {
    const el = document.getElementById('waste-categories');
    if (!el) return;
    el.innerHTML = WASTE_CATEGORIES.map(w => `
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
}

function renderWater() {
    const el = document.getElementById('water-stats');
    if (!el) return;
    el.innerHTML = WATER_STATS.map(w => `
        <div class="water-item">
            <span class="water-icon">${w.icon}</span>
            <div class="water-info">
                <div class="water-label">${w.label}</div>
                <div class="water-value">${w.value}</div>
            </div>
        </div>
    `).join('');
}

function initCarbonChart() {
    carbonChart = new BarChart('carbon-chart', {
        barColorTop: 'rgba(0, 212, 255, 0.6)',
        barColorBottom: 'rgba(0, 212, 255, 0.1)',
        highlightLast: true,
        highlightColorTop: 'rgba(0, 230, 118, 0.9)',
        highlightColorBottom: 'rgba(0, 230, 118, 0.2)',
        showTrendLine: true,
        trendLineColor: 'rgba(0, 230, 118, 0.6)',
        padding: { top: 20, right: 20, bottom: 30, left: 45 },
    });
    carbonChart.startResizeListener();

    const days = ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 'Today'];
    const emissions = [42, 38, 35, 33, 31, 28];
    carbonChart.setData(days.map((d, i) => ({
        label: d,
        value: emissions[i],
        valueLabel: `${emissions[i]}t`,
    })));
    carbonChart.draw();
}

function renderAIRecommendations() {
    const el = document.getElementById('ai-recommendations');
    if (!el) return;
    el.innerHTML = AI_RECOMMENDATIONS.map(r => `
        <div class="ai-rec">
            <div class="ai-rec-icon">${r.icon}</div>
            <div class="ai-rec-title">${r.title}</div>
            <div class="ai-rec-desc">${r.desc}</div>
            <div class="ai-rec-impact">⚡ ${r.impact}</div>
        </div>
    `).join('');
}
