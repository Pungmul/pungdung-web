export type StateCheckTrigger =
  | "visibilitychange"
  | "pageshow"
  | "focus"
  | "foreground"
  | "online"
  | "watch-inactivity"
  | "watch-probe"
  | "transport-failure"
  | "heartbeat-lost"
  | "manual";

export type StateCheckOptions = {
  trigger?: StateCheckTrigger;
  /** 백그라운드 체류 시간(ms). 임계치 이상이면 runtime instance 교체 */
  backgroundDurationMs?: number;
  /** stateCheck throttle만 우회한다 */
  force?: boolean;
  /** true면 STOMP만 재연결, false/미설정이면 상황에 따라 runtime 교체 */
  reconnectOnly?: boolean;
  /** true면 workerAlive 여부와 무관하게 runtime instance 교체 */
  forceRecreate?: boolean;
};

type ShouldRecreateRuntimeOptions = {
  reconnectOnly?: boolean | undefined;
  forceRecreate?: boolean | undefined;
  backgroundDurationMs: number;
  backgroundForceReconnectMs: number;
  workerAlive: boolean;
};

export function shouldForceRecreateAfterBackground(
  backgroundDurationMs: number,
  thresholdMs: number,
  trigger?: StateCheckTrigger
): boolean {
  return (
    trigger === "foreground" &&
    thresholdMs > 0 &&
    backgroundDurationMs >= thresholdMs
  );
}

export function shouldRecreateRuntime(
  options: ShouldRecreateRuntimeOptions
): boolean {
  if (options.reconnectOnly) {
    return false;
  }

  if (options.forceRecreate) {
    return true;
  }

  return (
    options.backgroundDurationMs >= options.backgroundForceReconnectMs ||
    !options.workerAlive
  );
}

export function shouldBypassRecoveryCooldown(
  trigger: StateCheckTrigger | undefined
): boolean {
  return (
    trigger === "foreground" ||
    trigger === "online" ||
    trigger === "heartbeat-lost" ||
    trigger === "transport-failure"
  );
}

export function isRecoveryCooldownElapsed(
  lastActionAt: number,
  cooldownMs: number
): boolean {
  return Date.now() - lastActionAt >= cooldownMs;
}

export function isStateCheckThrottled(
  lastCheckAt: number,
  throttleMs: number,
  force?: boolean
): boolean {
  if (force) {
    return false;
  }

  return Date.now() - lastCheckAt < throttleMs;
}
