/* =============================================
   AURA – Clock Module
   ============================================= */

import { createInterval } from '../utils.js';

export function initClock() {
    const el = document.getElementById('sidebar-time');
    if (!el) return;

    function update() {
        el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    update();
    return createInterval(update, 1000);
}
