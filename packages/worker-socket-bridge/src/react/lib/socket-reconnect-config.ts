export const DEFAULT_STATE_CHECK_THROTTLE_MS = 3_000;
/** watch-probe 연속 recovery 방지. foreground/heartbeat-lost는 cooldown bypass */
export const DEFAULT_RECOVERY_ACTION_COOLDOWN_MS = 5_000;
export const DEFAULT_CONNECTION_WATCH_INTERVAL_MS = 30_000;
export const DEFAULT_MESSAGE_INACTIVITY_PROBE_MS = 3 * 60_000;
/** visibility/pageshow 중복만 microtask로 합치고, ping은 즉시 시작한다 */
export const DEFAULT_FOREGROUND_DEBOUNCE_MS = 0;
export const DEFAULT_TRANSPORT_FAILURE_DEBOUNCE_MS = 200;
