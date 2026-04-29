export type WorkerRuntimeUrls = {
  shared: string;
  dedicated: string;
};

export type ResolveWorkerUrlsOptions = {
  basePath?: string;
  sharedWorkerFile?: string;
  dedicatedWorkerFile?: string;
};

const DEFAULT_SHARED_WORKER_FILE = "socket-worker.js";
const DEFAULT_DEDICATED_WORKER_FILE = "dedicated-worker.js";

export function resolveWorkerUrls(
  options: ResolveWorkerUrlsOptions = {}
): WorkerRuntimeUrls {
  const basePath = normalizeBasePath(options.basePath ?? "/");
  const sharedFile = options.sharedWorkerFile ?? DEFAULT_SHARED_WORKER_FILE;
  const dedicatedFile =
    options.dedicatedWorkerFile ?? DEFAULT_DEDICATED_WORKER_FILE;

  return {
    shared: `${basePath}${sharedFile}`,
    dedicated: `${basePath}${dedicatedFile}`,
  };
}

function normalizeBasePath(basePath: string): string {
  if (!basePath.endsWith("/")) {
    return `${basePath}/`;
  }
  return basePath;
}

export function isSharedWorkerSupported(): boolean {
  return typeof SharedWorker !== "undefined";
}

export function isDedicatedWorkerSupported(): boolean {
  return typeof Worker !== "undefined";
}
