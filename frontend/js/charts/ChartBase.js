/* =============================================
   AURA – ChartBase
   Reusable base class for Canvas charts
   Handles HiDPI, resize, visibility, cleanup
   ============================================= */

import { debounce, addListener } from '../utils.js';

export class ChartBase {
    /**
     * @param {string} canvasId — DOM id of the canvas element
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas?.getContext('2d');
        this._cleanups = [];
        this._drawn = false;
    }

    /** Check if the canvas is visible (non-zero size). */
    get isVisible() {
        if (!this.canvas) return false;
        const rect = this.canvas.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    /**
     * Set up HiDPI canvas and return dimensions.
     * @returns {{ w: number, h: number, ctx: CanvasRenderingContext2D }}
     */
    prepareCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.scale(dpr, dpr);
        return { w: rect.width, h: rect.height, ctx: this.ctx };
    }

    /**
     * Draw grid lines and y-axis labels.
     */
    drawGrid(padding, w, h, maxVal, divisions = 4) {
        const ctx = this.ctx;
        const plotH = h - padding.top - padding.bottom;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= divisions; i++) {
            const y = padding.top + (plotH / divisions) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
            ctx.font = '10px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round((maxVal / divisions) * (divisions - i)).toLocaleString(), padding.left - 8, y + 4);
        }
    }

    /**
     * Safe draw — only renders if canvas is visible.
     * Subclasses should override `render()`.
     */
    draw() {
        if (!this.isVisible) return;
        this.render();
        this._drawn = true;
    }

    /** Override in subclass to do actual rendering. */
    render() {}

    /**
     * Start listening for resize events (debounced).
     * @returns {Function} cleanup
     */
    startResizeListener() {
        const handler = debounce(() => this.draw(), 100);
        const cleanup = addListener(window, 'resize', handler);
        this._cleanups.push(cleanup);
        return cleanup;
    }

    /**
     * Cleanup all resources.
     */
    destroy() {
        this._cleanups.forEach(fn => fn());
        this._cleanups = [];
    }
}
