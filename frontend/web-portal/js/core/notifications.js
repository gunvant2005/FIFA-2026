/* =============================================
   AURA – Toast Notification System
   ============================================= */

import { PERIODIC_NOTIFICATIONS, INTERVALS } from '../config.js';
import { createInterval } from '../utils.js';

/**
 * Show a toast notification.
 * @param {'info'|'warning'|'danger'|'success'} type
 * @param {string} title
 * @param {string} message
 */
export function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

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

/**
 * Start the periodic notification cycle.
 * @returns {Function} cleanup
 */
export function initPeriodicNotifications() {
    let idx = 0;
    return createInterval(() => {
        const n = PERIODIC_NOTIFICATIONS[idx % PERIODIC_NOTIFICATIONS.length];
        showToast(n.type, n.title, n.msg);
        idx++;

        const countEl = document.getElementById('notification-count');
        if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
    }, INTERVALS.notifications);
}
