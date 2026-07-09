/* =============================================
   AURA – Main Application Entry
   Boots all modules, registers views, starts router
   ============================================= */

import { registerView, initRouter } from './router.js';
import { initParticles } from './core/particles.js';
import { initClock } from './core/clock.js';
import { showToast, initPeriodicNotifications } from './core/notifications.js';

// View modules
import * as DashboardView from './views/DashboardView.js';
import * as ChatView from './views/ChatView.js';
import * as NavigatorView from './views/NavigatorView.js';
import * as OperationsView from './views/OperationsView.js';
import * as TransportView from './views/TransportView.js';
import * as SustainabilityView from './views/SustainabilityView.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Global core modules (always running)
    initParticles();
    initClock();

    // 2. Register all views with router
    registerView('dashboard', DashboardView);
    registerView('chat', ChatView);
    registerView('navigator', NavigatorView);
    registerView('operations', OperationsView);
    registerView('transport', TransportView);
    registerView('sustainability', SustainabilityView);

    // 3. Start router (inits + enters default view)
    initRouter();

    // 4. Periodic notification system
    initPeriodicNotifications();

    // 5. Welcome toast
    setTimeout(() => {
        showToast('info', 'Welcome to AURA', 'AI Unified Real-time Assistant is online. All systems operational.');
    }, 1500);
});
