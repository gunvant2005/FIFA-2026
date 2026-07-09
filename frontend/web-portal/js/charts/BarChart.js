/* =============================================
   AURA – BarChart
   Reusable bar chart with gradient fills
   ============================================= */

import { ChartBase } from './ChartBase.js';

export class BarChart extends ChartBase {
    /**
     * @param {string} canvasId
     * @param {Object} options
     */
    constructor(canvasId, options = {}) {
        super(canvasId);
        this.options = {
            barColorTop: 'rgba(245, 166, 35, 0.8)',
            barColorBottom: 'rgba(245, 166, 35, 0.2)',
            highlightLast: false,
            highlightColorTop: 'rgba(0, 230, 118, 0.9)',
            highlightColorBottom: 'rgba(0, 230, 118, 0.2)',
            showTrendLine: false,
            trendLineColor: 'rgba(0, 230, 118, 0.6)',
            padding: { top: 20, right: 20, bottom: 30, left: 55 },
            barWidthRatio: 0.6,
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
        const {
            padding, barColorTop, barColorBottom,
            highlightLast, highlightColorTop, highlightColorBottom,
            showTrendLine, trendLineColor, barWidthRatio,
        } = this.options;
        const plotW = w - padding.left - padding.right;
        const plotH = h - padding.top - padding.bottom;
        const data = this.data;
        const maxVal = Math.max(...data.map(d => d.value)) * 1.1;

        ctx.clearRect(0, 0, w, h);

        const barW = (plotW / data.length) * barWidthRatio;
        const gap = (plotW / data.length) * (1 - barWidthRatio);

        data.forEach((d, i) => {
            const x = padding.left + (i / data.length) * plotW + gap / 2;
            const barH = (d.value / maxVal) * plotH;
            const y = padding.top + plotH - barH;

            const isHighlight = highlightLast && i === data.length - 1;
            const grad = ctx.createLinearGradient(0, y, 0, padding.top + plotH);
            grad.addColorStop(0, isHighlight ? highlightColorTop : barColorTop);
            grad.addColorStop(1, isHighlight ? highlightColorBottom : barColorBottom);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
            ctx.fill();

            // Value label
            ctx.fillStyle = 'rgba(240, 244, 248, 0.7)';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(d.valueLabel || `${d.value}`, x + barW / 2, y - 6);

            // X-axis label
            ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
            ctx.font = '9px Inter';
            ctx.fillText(d.label || '', x + barW / 2, h - 8);
        });

        // Trend line
        if (showTrendLine) {
            ctx.beginPath();
            data.forEach((d, i) => {
                const x = padding.left + (i / data.length) * plotW + gap / 2 + barW / 2;
                const y = padding.top + (1 - d.value / maxVal) * plotH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.strokeStyle = trendLineColor;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}
