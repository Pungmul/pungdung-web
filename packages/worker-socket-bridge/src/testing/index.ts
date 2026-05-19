import type { SocketManager as RealSocketManager } from "../client/socket-manager";

import { NoopSocketManager } from "./noop-socket-manager";

export type { CreateSocketManagerOptions } from "../client/socket-manager";
export type { SocketConnectionStateCheck } from "../client/socket-probe";
export { NoopSocketManager };

/** vitest alias용: 프로덕션 `SocketManager` import를 대체한다. */
export const SocketManager =
  NoopSocketManager as unknown as typeof RealSocketManager;
