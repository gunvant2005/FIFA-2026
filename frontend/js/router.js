/* =============================================
   AURA – Router
   View navigation with lazy init + cleanup
   ============================================= */

import { getState, setState } from './state.js';
import { VIEW_TITLES } from './config.js';
import { emit } from './eventBus.js';

const _viewModules = {};   // { viewName: module }
const _initialized = {};   // { viewName: true } — tracks which views have been init'd
const _activeCleanups = []; // cleanup fns from the currently active view

/**
 * Register a view module. Each module must export:
 *   init()    — called once when the view is first visited
 *   enter()   — called every time the view becomes active; returns cleanup fns array
 *   destroy() — (optional) full teardown
 */
export function registerView(name, module) {
    _viewModules[name] = module;
}

/**
 * Navigate to a view.
 */
export function navigateTo(viewName) {
    if (viewName === getState('currentView')) return;

    const prevView = getState('currentView');

    // 1. Run cleanup fns from the previous view's enter()
    _activeCleanups.forEach(fn => fn());
    _activeCleanups.length = 0;

    // 2. Update DOM
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewName}`)?.classList.add('active');

    document.getElementById('page-title').textContent = VIEW_TITLES[viewName] || viewName;

    // 3. Update state
    setState({ currentView: viewName });

    // 4. Lazy init + enter
    const mod = _viewModules[viewName];
    if (mod) {
        if (!_initialized[viewName]) {
            mod.init?.();
            _initialized[viewName] = true;
        }
        const cleanups = mod.enter?.() || [];
        _activeCleanups.push(...cleanups);
    }

    // 5. Emit navigation event
    emit('view:changed', { from: prevView, to: viewName });

    // 6. Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');
}

/**
 * Initialize router — set up nav link click handlers + mobile toggle.
 */
export function initRouter() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navigateTo(link.dataset.view);
        });
    });

    document.getElementById('menu-toggle')?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.toggle('open');
    });

    // Init the default view (dashboard)
    const defaultView = getState('currentView');
    const mod = _viewModules[defaultView];
    if (mod) {
        mod.init?.();
        _initialized[defaultView] = true;
        const cleanups = mod.enter?.() || [];
        _activeCleanups.push(...cleanups);
    }
}
