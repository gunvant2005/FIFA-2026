/* =============================================
   AURA – Navigator View
   Interactive stadium map with density overlay
   ============================================= */

import { getDensityColor, clamp, createInterval } from '../utils.js';
import { POIS, INTERVALS } from '../config.js';

export function init() {
    initZoneColors();
    initTooltips();
    initFilters();
    renderPOIList();
}

export function enter() {
    const cleanups = [];
    // Live density updates
    cleanups.push(createInterval(updateDensities, INTERVALS.mapDensity));
    return cleanups;
}

function initZoneColors() {
    const zones = document.querySelectorAll('.stadium-zone');
    zones.forEach(zone => {
        const density = parseInt(zone.dataset.density);
        const colors = getDensityColor(density);
        zone.style.fill = colors.fill;
        zone.style.stroke = colors.stroke;
    });
}

function initTooltips() {
    const zones = document.querySelectorAll('.stadium-zone');
    const tooltip = document.getElementById('zone-tooltip');

    zones.forEach(zone => {
        zone.addEventListener('mouseenter', () => {
            const density = zone.dataset.density;
            const zoneId = zone.dataset.zone;
            const colors = getDensityColor(parseInt(density));
            tooltip.innerHTML = `<strong>Zone ${zoneId}</strong><br>Density: ${density}% (${colors.label})<br>Capacity: ~6,000 seats`;
            tooltip.classList.add('visible');
        });

        zone.addEventListener('mousemove', (e) => {
            const mapArea = document.querySelector('.map-area');
            const rect = mapArea.getBoundingClientRect();
            tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
            tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
        });

        zone.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            document.querySelectorAll('.poi-group').forEach(g => {
                if (filter === 'density') {
                    g.classList.remove('hidden');
                } else {
                    g.classList.toggle('hidden', g.dataset.type !== filter);
                }
            });
        });
    });
}

function renderPOIList() {
    const poiList = document.getElementById('poi-list');
    if (!poiList) return;
    poiList.innerHTML = POIS.map(p => `
        <div class="poi-item" data-type="${p.type}">
            <span>${p.icon}</span>
            <span>${p.name}</span>
        </div>
    `).join('');
}

function updateDensities() {
    const zones = document.querySelectorAll('.stadium-zone');
    zones.forEach(zone => {
        let d = parseInt(zone.dataset.density);
        d = clamp(d + Math.round((Math.random() - 0.5) * 5), 15, 98);
        zone.dataset.density = d;
        const colors = getDensityColor(d);
        zone.style.fill = colors.fill;
        zone.style.stroke = colors.stroke;
    });
}
