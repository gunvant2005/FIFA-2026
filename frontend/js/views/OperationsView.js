/* =============================================
   AURA – Operations View
   Incidents, predictions, decisions, staff
   ============================================= */

import { INCIDENTS, PREDICTIONS, DECISIONS, RESOURCES, STAFF } from '../config.js';
import { showToast } from '../core/notifications.js';

export function init() {
    renderIncidents();
    renderPredictions();
    renderDecisions();
    renderResources();
    renderStaff();
    initBroadcast();
}

export function enter() {
    return []; // Static view, no intervals
}

function renderIncidents() {
    const el = document.getElementById('incidents-list');
    if (!el) return;
    el.innerHTML = INCIDENTS.map(inc => `
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
}

function renderPredictions() {
    const el = document.getElementById('predictions-list');
    if (!el) return;
    el.innerHTML = PREDICTIONS.map(p => `
        <div class="prediction-item">
            <div class="prediction-header">
                <span class="prediction-title">${p.title}</span>
                <span class="prediction-confidence">${p.confidence} confidence</span>
            </div>
            <div class="prediction-desc">${p.desc}</div>
            <button class="prediction-action">⚡ ${p.action}</button>
        </div>
    `).join('');

    el.querySelectorAll('.prediction-action').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('info', 'Action Triggered', btn.textContent.trim());
            btn.textContent = '✅ Executed';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.5';
        });
    });
}

function renderDecisions() {
    const el = document.getElementById('decision-cards');
    if (!el) return;
    el.innerHTML = DECISIONS.map(d => `
        <div class="decision-card">
            <h4>${d.title}</h4>
            <p>${d.desc}</p>
            <div class="decision-actions">
                <button class="btn-primary">${d.primary}</button>
                <button class="btn-secondary">${d.secondary}</button>
            </div>
        </div>
    `).join('');

    el.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('success', 'Decision Approved', btn.textContent);
            const card = btn.closest('.decision-card');
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        });
    });
}

function renderResources() {
    const el = document.getElementById('resource-grid');
    if (!el) return;
    el.innerHTML = RESOURCES.map(r => `
        <div class="resource-item">
            <div class="resource-icon">${r.icon}</div>
            <div class="resource-name">${r.name}</div>
            <div class="resource-value" style="color:${r.color}">${r.value}</div>
            <div class="resource-bar">
                <div class="resource-bar-fill" style="width:${r.pct}%;background:${r.color}"></div>
            </div>
        </div>
    `).join('');
}

function renderStaff() {
    const el = document.getElementById('staff-table-body');
    if (!el) return;
    el.innerHTML = STAFF.map(s => `
        <tr>
            <td>${s.team}</td>
            <td>${s.zone}</td>
            <td>${s.count}</td>
            <td><span class="status-dot ${s.status}"></span>${s.statusLabel}</td>
        </tr>
    `).join('');
}

function initBroadcast() {
    document.getElementById('broadcast-send')?.addEventListener('click', () => {
        const msg = document.getElementById('broadcast-message')?.value.trim();
        if (msg) {
            showToast('success', 'Broadcast Sent', `Message sent to ${document.getElementById('broadcast-target').value}`);
            document.getElementById('broadcast-message').value = '';
        }
    });
}
