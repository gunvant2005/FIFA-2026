/* =============================================
   AURA – Configuration & Data Constants
   All mock data, thresholds, and stadium config
   ============================================= */

// ── Stadium Configuration ──
export const STADIUM = {
    name: 'MetLife Stadium',
    location: 'East Rutherford, NJ',
    capacity: 82500,
    zones: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    zoneDensities: [65, 82, 71, 45, 88, 55, 93, 40, 60, 72],
};

// ── Match Info ──
export const MATCH = {
    teamA: { name: 'Brazil', flag: '🇧🇷', code: 'BRA' },
    teamB: { name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
    venue: 'MetLife Stadium, NJ',
    status: 'LIVE',
};

// ── View Titles ──
export const VIEW_TITLES = {
    dashboard: 'Command Center',
    chat: 'AI Fan Assistant',
    navigator: 'Stadium Navigator',
    operations: 'Operations Copilot',
    transport: 'Transport Intelligence',
    sustainability: 'Sustainability Dashboard',
};

// ── Gate Data ──
export const GATES = [
    { name: 'Gate A', throughput: 85, color: '#00d4ff' },
    { name: 'Gate B', throughput: 72, color: '#00e676' },
    { name: 'Gate C', throughput: 91, color: '#f5a623' },
    { name: 'Gate D', throughput: 58, color: '#a855f7' },
    { name: 'Gate E', throughput: 67, color: '#ec4899' },
    { name: 'Gate F', throughput: 43, color: '#448aff' },
];

// ── Dashboard Alerts ──
export const ALERTS = [
    { icon: '🔴', text: 'Zone G density exceeds 90% — crowd management team alerted', type: 'danger', time: '2 min ago' },
    { icon: '⚠️', text: 'Gate C throughput spike — additional scanners activated', type: 'warning', time: '5 min ago' },
    { icon: '✅', text: 'Medical team responded to Section 118 — situation resolved', type: 'success', time: '8 min ago' },
    { icon: '🔵', text: 'AI detected unusual movement pattern near East concourse', type: 'info', time: '12 min ago' },
    { icon: '⚠️', text: 'Food vendor Section 200 running low on beverages', type: 'warning', time: '15 min ago' },
];

// ── AI Match Summaries ──
export const AI_SUMMARIES = [
    `<p>⚽ <span class="ai-highlight">42nd minute</span> — Brazil leads 1-0 after a stunning free kick by Vinícius Jr. Stadium atmosphere is electric with <span class="ai-highlight">67,842 fans</span> on their feet.</p>
     <p>📊 Crowd density in <span class="ai-highlight">Zone G is at 93%</span> — recommending staff redeployment to manage concourse flow. Zones D & H remain comfortable at under 50%.</p>
     <p>🌡️ Temperature has dropped 2°C in the last hour. HVAC system auto-adjusted. <span class="ai-highlight">No weather alerts</span> expected for the remainder of the match.</p>`,

    `<p>⚽ <span class="ai-highlight">58th minute</span> — Argentina equalizes! Messi with a magnificent assist to Álvarez. The noise level readings peaked at <span class="ai-highlight">128 dB</span>.</p>
     <p>🚶 Post-goal movement surge detected — <span class="ai-highlight">+15% concourse traffic</span> in the following 3 minutes. Food court queues averaging 4.2 minutes.</p>
     <p>🔒 All security checkpoints operating normally. Zero incidents reported in the last 30 minutes.</p>`,

    `<p>⚽ <span class="ai-highlight">75th minute</span> — Tactical substitutions by both teams. Match intensity increasing with <span class="ai-highlight">12 corner kicks</span> total.</p>
     <p>🚍 Pre-departure transport analysis: <span class="ai-highlight">23% of fans</span> are expected to leave within 5 minutes of final whistle. Metro capacity at 72%.</p>
     <p>♻️ Sustainability update: Recycling rate at <span class="ai-highlight">78%</span> — ahead of tournament target by 8 points.</p>`,
];

// ── Operations Data ──
export const INCIDENTS = [
    { type: '🚨 Medical Alert', status: 'active', summary: 'AI Summary: Fan in Section 118 reported dizziness. Medical team dispatched. Vitals being monitored. Heat-related — water distributed to surrounding rows.', zone: 'Zone B', time: '3 min ago' },
    { type: '⚠️ Crowd Surge', status: 'critical', summary: 'AI Summary: Zone G experiencing 93% density. Crowd flow algorithm activated. Staff redirecting fans via South concourse. ETA to resolve: 8 minutes.', zone: 'Zone G', time: '7 min ago' },
    { type: '✅ Gate Malfunction', status: 'resolved', summary: 'AI Summary: Gate C scanner #3 experienced intermittent failure. Backup scanner activated within 30 seconds. No significant queue buildup. Root cause: firmware update needed.', zone: 'Gate C', time: '22 min ago' },
];

export const PREDICTIONS = [
    { title: '🌊 Crowd Surge Predicted — Zone E', desc: 'Based on historical patterns and current flow rates, Zone E will reach 90% density in approximately 12 minutes if no action is taken.', confidence: '87%', action: 'Deploy 4 Staff to Zone E' },
    { title: '🚗 Traffic Spike — Post-Match', desc: 'AI models predict a 3x traffic increase on Route 3 within 5 minutes of final whistle. Pre-positioning traffic officers recommended.', confidence: '92%', action: 'Alert Traffic Control' },
    { title: '🍔 Food Shortage — Zone B', desc: 'Beverage inventory in Zone B vendors projected to deplete in 25 minutes at current consumption rate. Resupply recommended now.', confidence: '78%', action: 'Trigger Resupply' },
];

export const DECISIONS = [
    { title: '🔄 Reroute Zone G Fans', desc: 'AI recommends opening auxiliary corridor 3 to relieve Zone G congestion. This would reduce density by an estimated 15% within 5 minutes.', primary: 'Approve Reroute', secondary: 'Dismiss' },
    { title: '📢 Half-time Announcement', desc: 'AI-generated announcement ready for broadcast: Safety reminders, food court locations, and accessibility information in 4 languages.', primary: 'Send Broadcast', secondary: 'Edit' },
];

export const RESOURCES = [
    { icon: '🏥', name: 'Medical Kits', value: '24/30', pct: 80, color: '#00e676' },
    { icon: '🚧', name: 'Barriers', value: '45/50', pct: 90, color: '#00d4ff' },
    { icon: '💧', name: 'Water Stations', value: '18/20', pct: 90, color: '#448aff' },
    { icon: '📻', name: 'Radios', value: '92/100', pct: 92, color: '#f5a623' },
];

export const STAFF = [
    { team: 'Security Alpha', zone: 'Zone A-C', count: 24, status: 'active', statusLabel: 'Active' },
    { team: 'Security Bravo', zone: 'Zone D-F', count: 18, status: 'active', statusLabel: 'Active' },
    { team: 'Medical Team 1', zone: 'Zone B', count: 6, status: 'deployed', statusLabel: 'Deployed' },
    { team: 'Medical Team 2', zone: 'Standby', count: 4, status: 'standby', statusLabel: 'Standby' },
    { team: 'Crowd Control', zone: 'Zone G', count: 12, status: 'deployed', statusLabel: 'Deployed' },
    { team: 'Maintenance', zone: 'All Zones', count: 8, status: 'active', statusLabel: 'Active' },
];

// ── Transport Data ──
export const TRAFFIC_ROUTES = [
    { name: 'Route 3 East', status: 'Heavy traffic — 25 min delay', time: '35 min', icon: '🔴', bg: 'rgba(255,82,82,0.1)' },
    { name: 'NJ Turnpike South', status: 'Moderate — 10 min delay', time: '22 min', icon: '🟡', bg: 'rgba(255,171,0,0.1)' },
    { name: 'Route 120', status: 'Clear — no delays', time: '12 min', icon: '🟢', bg: 'rgba(0,230,118,0.1)' },
    { name: 'I-95 North', status: 'Moderate — 8 min delay', time: '18 min', icon: '🟡', bg: 'rgba(255,171,0,0.1)' },
];

export const PARKING_LOTS = [
    { name: 'Lot A', pct: 92, color: '#ff5252' },
    { name: 'Lot B', pct: 78, color: '#ff6b35' },
    { name: 'Lot C', pct: 55, color: '#ffab00' },
    { name: 'Lot D', pct: 33, color: '#00e676' },
    { name: 'Lot K', pct: 88, color: '#ff5252' },
];

export const TRANSIT_SCHEDULE = [
    { mode: '🚇', name: 'NJ Transit to NYC Penn', next: 'Platform 2', countdown: '3 min', color: '#00e676' },
    { mode: '🚇', name: 'NJ Transit to Hoboken', next: 'Platform 4', countdown: '8 min', color: '#00d4ff' },
    { mode: '🚌', name: 'FIFA Shuttle — Times Square', next: 'Bay C', countdown: '2 min', color: '#00e676' },
    { mode: '🚌', name: 'FIFA Shuttle — Newark Airport', next: 'Bay A', countdown: '12 min', color: '#ffab00' },
    { mode: '🚍', name: 'NJ Transit Bus 160', next: 'Stop 3', countdown: '6 min', color: '#00d4ff' },
];

export const CARBON_MODES = [
    { icon: '🚇', name: 'Public Transit', value: '0.04 kg CO₂/fan', pct: 10, color: '#00e676' },
    { icon: '🚌', name: 'Shuttle Bus', value: '0.08 kg CO₂/fan', pct: 20, color: '#00d4ff' },
    { icon: '🚗', name: 'Personal Car', value: '0.52 kg CO₂/fan', pct: 65, color: '#ff6b35' },
    { icon: '🚕', name: 'Rideshare', value: '0.31 kg CO₂/fan', pct: 40, color: '#ffab00' },
    { icon: '🚲', name: 'Bike / Walk', value: '0.00 kg CO₂/fan', pct: 0, color: '#00e676' },
];

export const RIDESHARE_DATA = [
    { name: 'Uber', count: 142, wait: 'Avg wait: 8 min', color: '#00d4ff' },
    { name: 'Lyft', count: 87, wait: 'Avg wait: 11 min', color: '#ec4899' },
    { name: 'FIFA Official', count: 35, wait: 'Avg wait: 3 min', color: '#f5a623' },
];

// ── Sustainability Data ──
export const WASTE_CATEGORIES = [
    { icon: '♻️', name: 'Recyclables', pct: 78, color: '#00e676' },
    { icon: '🗑️', name: 'General Waste', pct: 45, color: '#ff6b35' },
    { icon: '🥤', name: 'Compostable', pct: 62, color: '#ffab00' },
    { icon: '🧴', name: 'Plastics', pct: 85, color: '#00d4ff' },
];

export const WATER_STATS = [
    { icon: '💧', label: 'Total Consumption', value: '12,400 L' },
    { icon: '🔄', label: 'Recycled Water', value: '4,200 L' },
    { icon: '🚿', label: 'Saved vs Target', value: '-15%' },
];

export const AI_RECOMMENDATIONS = [
    { icon: '💡', title: 'Dim Zone D Lights', desc: 'Zone D is at 45% density. Reducing lighting by 30% would save 180 kWh with no fan impact.', impact: 'Save 180 kWh' },
    { icon: '❄️', title: 'HVAC Optimization', desc: 'Temperature dropped 2°C. AI recommends reducing cooling in Zones A, H, J by 20%.', impact: 'Save 240 kWh' },
    { icon: '🗑️', title: 'Deploy Waste Team', desc: 'Bin sensors show Zone G bins at 85% capacity. Deploy collection team now to prevent overflow.', impact: 'Prevent overflow' },
];

// ── Navigator POIs ──
export const POIS = [
    { icon: '🍔', name: 'Stadium Grill — Zone D', type: 'food' },
    { icon: '🍕', name: 'Pizza Corner — Zone E', type: 'food' },
    { icon: '🌮', name: 'Taco Fiesta — Zone J', type: 'food' },
    { icon: '🚻', name: 'Restroom — Zone B', type: 'restroom' },
    { icon: '🚻', name: 'Restroom — Zone J', type: 'restroom' },
    { icon: '🏥', name: 'First Aid — Zone D', type: 'medical' },
    { icon: '🏥', name: 'First Aid — Zone E', type: 'medical' },
    { icon: '🚪', name: 'Exit — Gate A (North)', type: 'exit' },
    { icon: '🚪', name: 'Exit — Gate D (South)', type: 'exit' },
];

// ── Notification Cycle ──
export const PERIODIC_NOTIFICATIONS = [
    { type: 'info', title: 'AI Insight', msg: 'Fan sentiment analysis: 92% positive based on social media feeds' },
    { type: 'warning', title: 'Crowd Alert', msg: 'Zone E approaching 85% density — monitoring closely' },
    { type: 'success', title: 'System Update', msg: 'All 24 CCTV feeds processing normally. CV models at 99.2% accuracy' },
    { type: 'info', title: 'Transport Update', msg: 'NJ Transit has added 2 extra services for post-match departures' },
    { type: 'success', title: 'Sustainability', msg: 'Stadium is on track to beat recycling target by 12%' },
];

// ── Density Thresholds ──
export const DENSITY_THRESHOLDS = {
    low: 50,
    medium: 70,
    high: 85,
};

// ── Update Intervals (ms) ──
export const INTERVALS = {
    fanFlow: 3000,
    gateBars: 4000,
    zoneGrid: 5000,
    kpiUpdate: 5000,
    aiSummary: 20000,
    mapDensity: 6000,
    notifications: 25000,
};
