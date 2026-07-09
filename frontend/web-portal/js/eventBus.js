/* =============================================
   AURA – Event Bus
   Pub/sub for decoupled communication
   ============================================= */

const _listeners = new Map();

/**
 * Subscribe to an event.
 * @param {string} event — event name
 * @param {Function} callback — handler function
 * @returns {Function} unsubscribe function
 */
export function on(event, callback) {
    if (!_listeners.has(event)) {
        _listeners.set(event, new Set());
    }
    _listeners.get(event).add(callback);
    return () => off(event, callback);
}

/**
 * Unsubscribe from an event.
 */
export function off(event, callback) {
    _listeners.get(event)?.delete(callback);
}

/**
 * Emit an event with optional data.
 * @param {string} event — event name
 * @param {*} data — payload
 */
export function emit(event, data) {
    if (_listeners.has(event)) {
        for (const fn of _listeners.get(event)) {
            fn(data);
        }
    }
}
