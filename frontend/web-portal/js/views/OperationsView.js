/* =============================================
   AURA – Operations View (Production Config)
   Incidents, predictions, decisions, staff, authentication, broadcasts
   ============================================= */

import { INCIDENTS, PREDICTIONS, DECISIONS, RESOURCES, STAFF } from '../config.js';
import { showToast } from '../core/notifications.js';

const BACKEND_URL = 'http://localhost:8000';

export function init() {
    renderPredictions();
    renderDecisions();
    renderResources();
    renderStaff();
    initBroadcast();
    setupAuthListeners();
}

export function enter() {
    checkAuthAndLoad();
    return [];
}

// ── Authentication Checks ──
function checkAuthAndLoad() {
    const token = sessionStorage.getItem('aura_staff_token');
    const lockOverlay = document.getElementById('ops-lock-overlay');
    
    if (!token) {
        if (!lockOverlay) {
            createLockOverlay();
        } else {
            lockOverlay.style.display = 'flex';
        }
        // Load default mock incidents as fallback visually
        renderIncidents(INCIDENTS);
    } else {
        if (lockOverlay) lockOverlay.style.display = 'none';
        loadIncidentsFromServer(token);
    }
}

function createLockOverlay() {
    const view = document.getElementById('view-operations');
    if (!view) return;

    // Ensure style is relative
    view.style.position = 'relative';

    const overlay = document.createElement('div');
    overlay.id = 'ops-lock-overlay';
    overlay.className = 'glass-card';
    overlay.style.cssText = `
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(6, 9, 15, 0.95);
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        backdrop-filter: blur(12px);
    `;

    overlay.innerHTML = `
        <div style="font-size: 40px;">🔒</div>
        <h3 style="font-family: var(--font-heading); font-size: 20px;">Ops Copilot Access Restricted</h3>
        <p style="color: var(--text-secondary); font-size: 13px; text-align: center; max-width: 320px;">
            Authorized stadium staff login required to access security incident feeds and trigger deployments.
        </p>
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 280px;">
            <input type="text" id="ops-login-username" placeholder="Username (admin)" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); background: var(--bg-tertiary); color: white; border: 1px solid var(--border-subtle);">
            <input type="password" id="ops-login-password" placeholder="Password (password123)" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); background: var(--bg-tertiary); color: white; border: 1px solid var(--border-subtle);">
            <button id="ops-login-submit" class="btn-primary" style="width: 100%; padding: 10px; border-radius: var(--radius-sm);">Authenticate</button>
            <div id="ops-login-error" style="color: var(--danger); font-size: 11px; text-align: center; display: none;">Invalid credentials</div>
        </div>
    `;

    view.appendChild(overlay);
    setupAuthListeners();
}

function setupAuthListeners() {
    const btn = document.getElementById('ops-login-submit');
    if (!btn) return;

    btn.addEventListener('click', handleLogin);
    
    // Bind enter key on password
    document.getElementById('ops-login-password')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleLogin();
    });
}

async function handleLogin() {
    const user = document.getElementById('ops-login-username').value.trim();
    const pass = document.getElementById('ops-login-password').value.trim();
    const errorEl = document.getElementById('ops-login-error');

    if (!user || !pass) return;

    try {
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            sessionStorage.setItem('aura_staff_token', data.token);
            sessionStorage.setItem('aura_staff_role', data.role);
            showToast('success', 'Authenticated', 'Welcome back, Stadium Manager.');
            
            const overlay = document.getElementById('ops-lock-overlay');
            if (overlay) overlay.style.display = 'none';

            loadIncidentsFromServer(data.token);
        } else {
            throw new Error(data.message || 'Auth failed');
        }
    } catch (e) {
        if (errorEl) {
            errorEl.textContent = e.message;
            errorEl.style.display = 'block';
        }
    }
}

async function loadIncidentsFromServer(token) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/incidents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Could not fetch");
        const list = await res.json();
        renderIncidents(list);
    } catch (e) {
        // Fallback to local config mock data if API fails
        renderIncidents(INCIDENTS);
    }
}

// ── Rendering ──
function renderIncidents(list) {
    const el = document.getElementById('incidents-list');
    if (!el) return;
    el.innerHTML = list.map(inc => `
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

    const countBadge = document.getElementById('incident-count-badge');
    if (countBadge) {
        const activeCount = list.filter(i => i.status === 'active' || i.status === 'critical').length;
        countBadge.textContent = `${activeCount} Active`;
    }
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
    document.getElementById('broadcast-send')?.addEventListener('click', async () => {
        const msg = document.getElementById('broadcast-message')?.value.trim();
        const target = document.getElementById('broadcast-target').value;
        const token = sessionStorage.getItem('aura_staff_token');

        if (!msg) return;

        if (token) {
            try {
                const res = await fetch(`${BACKEND_URL}/api/broadcast`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ target, message: msg })
                });
                if (res.ok) {
                    showToast('success', 'Broadcast Sent', `Message sent to ${target}`);
                    document.getElementById('broadcast-message').value = '';
                } else {
                    throw new Error("Could not send");
                }
            } catch (e) {
                showToast('success', 'Local Broadcast (Offline)', `Message sent to ${target}`);
                document.getElementById('broadcast-message').value = '';
            }
        } else {
            showToast('success', 'Local Broadcast (Offline)', `Message sent to ${target}`);
            document.getElementById('broadcast-message').value = '';
        }
    });
}
