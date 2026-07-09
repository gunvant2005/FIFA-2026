/* =============================================
   AURA – AreaChart
   Reusable area + line chart
   ============================================= */

import { ChartBase } from './ChartBase.js';

export class AreaChart extends ChartBase {
    /**
     * @param {string} canvasId
     * @param {Object} options
     * @param {string} options.lineColor — line stroke color
     * @param {string} options.fillColorTop — gradient top
     * @param {string} options.fillColorBottom — gradient bottom
     * @param {boolean} [options.showDot] — show current point dot
     * @param {Object} [options.padding]
     */
    constructor(canvasId, options = {}) {
        super(canvasId);
        this.options = {
            lineColor: '#00d4ff',
            fillColorTop: 'rgba(0, 212, 255, 0.25)',
            fillColorBottom: 'rgba(0, 212, 255, 0.01)',
            showDot: true,
            padding: { top: 20, right: 20, bottom: 30, left: 50 },
            ...options,
        };
        this.data = [];
    }

    setData(data) {
        this.data = data;
    }

    render() {
        if (this.data.length === 0) return;
        const { w, h, ctx } = this.prepareCanvas();
        const { padding, lineColor, fillColorTop, fillColorBottom, showDot } = this.options;
        const plotW = w - padding.left - padding.right;
        const plotH = h - padding.top - padding.bottom;
        const data = this.data;
        const maxVal = Math.max(...data.map(d => d.value));

        ctx.clearRect(0, 0, w, h);
        this.drawGrid(padding, w, h, maxVal);

        // X-axis labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        const step = Math.max(1, Math.floor(data.length / 5));
        for (let i = 0; i < data.length; i += step) {
            const x = padding.left + (i / (data.length - 1)) * plotW;
            ctx.fillText(data[i].label || '', x, h - 8);
        }

        // Build path points
        const getPoint = (i) => ({
            x: padding.left + (i / (data.length - 1)) * plotW,
            y: padding.top + (1 - data[i].value / maxVal) * plotH,
        });

        // Area fill
        const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
        gradient.addColorStop(0, fillColorTop);
        gradient.addColorStop(1, fillColorBottom);

        ctx.beginPath();
        ctx.moveTo(padding.left, h - padding.bottom);
        for (let i = 0; i < data.length; i++) {
            const p = getPoint(i);
            if (i === 0) {
                ctx.lineTo(p.x, p.y);
            } else {
                const prev = getPoint(i - 1);
                const cpx = (prev.x + p.x) / 2;
                ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
            }
        }
        ctx.lineTo(padding.left + plotW, h - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Line
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
            const p = getPoint(i);
            if (i === 0) {
                ctx.moveTo(p.x, p.y);
            } else {
                const prev = getPoint(i - 1);
                const cpx = (prev.x + p.x) / 2;
                ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
            }
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow
        ctx.shadowColor = lineColor;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Current point dot
        if (showDot && data.length > 0) {
            const last = getPoint(data.length - 1);
            ctx.beginPath();
            ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(last.x, last.y, 8, 0, Math.PI * 2);
            ctx.strokeStyle = lineColor.replace(')', ', 0.3)').replace('rgb', 'rgba');
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}
