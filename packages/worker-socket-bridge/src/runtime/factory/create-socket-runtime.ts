import {
  MainThreadSocketRuntime,
  WorkerSocketRuntime,
} from "../socket-runtime";
import {
  DedicatedWorkerTransport,
  isDedicatedWorkerSupported,
  isSharedWorkerSupported,
  resolveWorkerUrls,
  type ResolveWorkerUrlsOptions,
  SharedWorkerTransport,
} from "../transport";
import type { SocketRuntime, SocketRuntimeMode } from "../types";

export type CreateSocketRuntimeOptions = ResolveWorkerUrlsOptions;

/** 테스트용: 브라우저에서는 dedicated worker만 사용. SSR/prerender는 Worker API가 없어 main-thread로 대체. */
const FORCE_DEDICATED_WORKER_FOR_TESTING = false;

function createDedicatedOrMainThreadRuntime(
  options: CreateSocketRuntimeOptions
): SocketRuntime {
  const urls = resolveWorkerUrls(options);

  if (isDedicatedWorkerSupported()) {
    return new WorkerSocketRuntime(
      DedicatedWorkerTransport.create(urls.dedicated)
    );
  }

  return new MainThreadSocketRuntime();
}

export function createSocketRuntime(
  mode: SocketRuntimeMode,
  options: CreateSocketRuntimeOptions = {}
): SocketRuntime {
  if (FORCE_DEDICATED_WORKER_FOR_TESTING) {
    return createDedicatedOrMainThreadRuntime(options);
  }

  const urls = resolveWorkerUrls(options);

  switch (mode) {
    case "shared":
      return new WorkerSocketRuntime(SharedWorkerTransport.create(urls.shared));
    case "dedicated":
      return new WorkerSocketRuntime(
        DedicatedWorkerTransport.create(urls.dedicated)
      );
    case "main-thread":
      return new MainThreadSocketRuntime();
    default: {
      const exhaustive: never = mode;
      throw new Error(`Unsupported runtime mode: ${String(exhaustive)}`);
    }
  }
}

export function getDefaultRuntimeFallbackChain(): SocketRuntimeMode[] {
  if (FORCE_DEDICATED_WORKER_FOR_TESTING) {
    return isDedicatedWorkerSupported() ? ["dedicated"] : ["main-thread"];
  }

  const chain: SocketRuntimeMode[] = [];
  if (isSharedWorkerSupported()) {
    chain.push("shared");
  }
  if (isDedicatedWorkerSupported()) {
    chain.push("dedicated");
  }
  chain.push("main-thread");
  return chain;
}

export function createWorkerTransport(
  preferShared: boolean,
  options: CreateSocketRuntimeOptions = {}
): SocketRuntime {
  if (FORCE_DEDICATED_WORKER_FOR_TESTING) {
    return createDedicatedOrMainThreadRuntime(options);
  }

  if (preferShared && isSharedWorkerSupported()) {
    return createSocketRuntime("shared", options);
  }
  if (isDedicatedWorkerSupported()) {
    return createSocketRuntime("dedicated", options);
  }
  return createSocketRuntime("main-thread", options);
}
