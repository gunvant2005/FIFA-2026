/* =============================================
   AURA – Shared Utilities
   Helpers, formatters, color functions, polyfills
   ============================================= */

import { DENSITY_THRESHOLDS } from './config.js';

// ── roundRect Polyfill ──
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
        if (!Array.isArray(radii)) radii = [radii, radii, radii, radii];
        const [tl, tr, br, bl] = radii.map(r => Math.min(r || 0, w / 2, h / 2));
        this.moveTo(x + tl, y);
        this.lineTo(x + w - tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + tr);
        this.lineTo(x + w, y + h - br);
        this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
        this.lineTo(x + bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - bl);
        this.lineTo(x, y + tl);
        this.quadraticCurveTo(x, y, x + tl, y);
        this.closePath();
        return this;
    };
}

/**
 * Format chat message text with markdown-like syntax.
 * Handles **bold** and *italic* without nesting conflicts.
 */
export function formatMessage(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')   // **bold** first
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')  // *italic* — not adjacent to *
        .replace(/\n/g, '<br>');
}

/**
 * Get density color scheme based on percentage.
 * @param {number} pct — density percentage 0-100
 * @returns {{ fill: string, stroke: string, bg: string, text: string, label: string }}
 */
export function getDensityColor(pct) {
    if (pct < DENSITY_THRESHOLDS.low) {
        return { fill: 'rgba(0,230,118,0.25)', stroke: 'rgba(0,230,118,0.5)', bg: 'rgba(0,230,118,0.25)', text: '#00e676', label: 'Low' };
    }
    if (pct < DENSITY_THRESHOLDS.medium) {
        return { fill: 'rgba(255,171,0,0.25)', stroke: 'rgba(255,171,0,0.5)', bg: 'rgba(255,171,0,0.25)', text: '#ffab00', label: 'Medium' };
    }
    if (pct < DENSITY_THRESHOLDS.high) {
        return { fill: 'rgba(255,107,53,0.3)', stroke: 'rgba(255,107,53,0.5)', bg: 'rgba(255,107,53,0.25)', text: '#ff6b35', label: 'High' };
    }
    return { fill: 'rgba(255,82,82,0.35)', stroke: 'rgba(255,82,82,0.6)', bg: 'rgba(255,82,82,0.3)', text: '#ff5252', label: 'Critical' };
}

/**
 * Clamp a number between min and max.
 */
export function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

/**
 * Generate a random integer in [min, max].
 */
export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Create a debounced version of a function.
 */
export function debounce(fn, delay = 150) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Safely manage intervals — returns a cleanup function.
 * @param {Function} fn — function to call
 * @param {number} ms — interval in ms
 * @returns {Function} clear function
 */
export function createInterval(fn, ms) {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
}

/**
 * Safely manage timeouts — returns a cleanup function.
 */
export function createTimeout(fn, ms) {
    const id = setTimeout(fn, ms);
    return () => clearTimeout(id);
}

/**
 * Safely add an event listener and return a cleanup function.
 */
export function addListener(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    return () => target.removeEventListener(event, handler, options);
}
