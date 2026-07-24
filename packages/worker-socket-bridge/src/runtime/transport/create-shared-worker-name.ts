import { v5 as uuidv5 } from "uuid";

const SOCKET_WORKER_NAMESPACE = uuidv5("pungdung-jal-doeja", uuidv5.DNS);
const SOCKET_WORKER_NAME_PREFIX = "pungdung-socket-";

export function createSharedWorkerName(url: string): string {
  const endpoint = new URL(url, globalThis.location?.origin).href;
  return `${SOCKET_WORKER_NAME_PREFIX}${uuidv5(endpoint, SOCKET_WORKER_NAMESPACE)}`;
}
