/* =============================================
   AURA – GaugeChart
   Circular progress gauge (sustainability score)
   ============================================= */

import { ChartBase } from './ChartBase.js';

export class GaugeChart extends ChartBase {
    /**
     * @param {string} canvasId
     * @param {Object} options
     */
    constructor(canvasId, options = {}) {
        super(canvasId);
        this.options = {
            size: 200,
            lineWidth: 10,
            colorStart: '#00e676',
            colorEnd: '#00d4ff',
            trackColor: 'rgba(148, 163, 184, 0.1)',
            glowColor: '#00e676',
            ...options,
        };
        this.value = 0;
    }

    setValue(val) {
        this.value = val;
    }

    render() {
        const { size, lineWidth, colorStart, colorEnd, trackColor, glowColor } = this.options;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = size * dpr;
        this.canvas.height = size * dpr;
        const ctx = this.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        const center = size / 2;
        const radius = (size / 2) - lineWidth - 10;

        // Background track
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.strokeStyle = trackColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Score arc
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (this.value / 100) * Math.PI * 2;
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);

        ctx.beginPath();
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glow
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}
