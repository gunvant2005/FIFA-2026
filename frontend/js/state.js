/* =============================================
   AURA – Centralized State Store
   Reactive state with subscriber pattern
   ============================================= */

const _state = {
    currentView: 'dashboard',
    fanCount: 67842,
    crowdDensity: 78,
    activeIncidents: 3,
    transportArrivals: 12450,
    fanFlowData: [],
    isListening: false,
    chatQueryCount: 1247,
};

const _subscribers = new Map();

/**
 * Get a shallow copy of the full state or a specific key.
 * @param {string} [key] — optional key to get a specific value
 * @returns {*}
 */
export function getState(key) {
    if (key) return _state[key];
    return { ..._state };
}

/**
 * Update one or more state values and notify subscribers.
 * @param {Object} updates — key-value pairs to merge into state
 */
export function setState(updates) {
    const changedKeys = [];
    for (const [key, value] of Object.entries(updates)) {
        if (_state[key] !== value) {
            _state[key] = value;
            changedKeys.push(key);
        }
    }
    // Notify subscribers of changed keys
    for (const key of changedKeys) {
        if (_subscribers.has(key)) {
            for (const fn of _subscribers.get(key)) {
                fn(_state[key], key);
            }
        }
    }
    // Also notify wildcard subscribers
    if (changedKeys.length > 0 && _subscribers.has('*')) {
        for (const fn of _subscribers.get('*')) {
            fn({ ..._state }, changedKeys);
        }
    }
}

/**
 * Subscribe to state changes for a specific key or '*' for all.
 * @param {string} key — state key to watch
 * @param {Function} callback — called with (newValue, key)
 * @returns {Function} unsubscribe function
 */
export function subscribe(key, callback) {
    if (!_subscribers.has(key)) {
        _subscribers.set(key, new Set());
    }
    _subscribers.get(key).add(callback);

    return () => {
        _subscribers.get(key)?.delete(callback);
    };
}
