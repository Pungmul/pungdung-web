import type { ResponseEnvelope } from "../../protocol";
import type { SocketRuntime, SocketRuntimeMode } from "../types";

import {
  createSocketRuntime,
  type CreateSocketRuntimeOptions,
  getDefaultRuntimeFallbackChain,
} from "./create-socket-runtime";

export type SocketRuntimeFallbackControllerOptions = CreateSocketRuntimeOptions & {
  fallbackChain?: SocketRuntimeMode[];
  onRuntimeChange?: (mode: SocketRuntimeMode) => void;
};

export type CreateSocketRuntimeWithFallbackOptions =
  SocketRuntimeFallbackControllerOptions;

export function createSocketRuntimeWithFallback(
  options: SocketRuntimeFallbackControllerOptions = {}
): SocketRuntimeFallbackController {
  return new SocketRuntimeFallbackController(options);
}

export class SocketRuntimeFallbackController {
  private readonly fallbackChain: SocketRuntimeMode[];
  private readonly options: SocketRuntimeFallbackControllerOptions;
  private chainIndex = 0;
  private currentRuntime: SocketRuntime;

  constructor(options: SocketRuntimeFallbackControllerOptions = {}) {
    this.options = options;
    this.fallbackChain =
      options.fallbackChain ?? getDefaultRuntimeFallbackChain();
    const initialMode = this.fallbackChain[this.chainIndex]!;
    this.currentRuntime = createSocketRuntime(initialMode, options);
    options.onRuntimeChange?.(this.currentRuntime.mode);
  }

  get runtime(): SocketRuntime {
    return this.currentRuntime;
  }

  attachHandler(handler: (response: ResponseEnvelope) => void): void {
    this.currentRuntime.setMessageHandler(handler);
  }

  tryNextRuntime(): SocketRuntime | null {
    this.currentRuntime.dispose();
    this.chainIndex += 1;

    const nextMode = this.fallbackChain[this.chainIndex];
    if (!nextMode) {
      return null;
    }

    this.currentRuntime = createSocketRuntime(nextMode, this.options);
    this.options.onRuntimeChange?.(this.currentRuntime.mode);
    return this.currentRuntime;
  }
}
