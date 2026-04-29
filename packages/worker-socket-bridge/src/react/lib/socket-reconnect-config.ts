import { HEARTBEAT_LOST_RECREATE_THRESHOLD_MS } from "../../../stomp/stomp-liveness";

export const DEFAULT_STATE_CHECK_THROTTLE_MS = 3_000;
/** watch-probe 연속 recovery 방지. foreground/heartbeat-lost는 cooldown bypass */
export const DEFAULT_RECOVERY_ACTION_COOLDOWN_MS = 5_000;
export const DEFAULT_CONNECTION_WATCH_INTERVAL_MS = 30_000;
/** heartbeat lost stale(ms)와 동일. 30s 고정값 대신 config heartbeat × tolerance */
export const DEFAULT_BACKGROUND_FORCE_RECONNECT_MS =
  HEARTBEAT_LOST_RECREATE_THRESHOLD_MS;
export const DEFAULT_MESSAGE_INACTIVITY_PROBE_MS = 3 * 60_000;
export const DEFAULT_FOREGROUND_DEBOUNCE_MS = 150;
export const DEFAULT_TRANSPORT_FAILURE_DEBOUNCE_MS = 200;
