import { readInternalHref, SERVICE_WORKER_ENTRY_PARAM } from "../navigation-contract";

export function readServiceWorkerEntry(url: URL) {
  const raw = url.searchParams.get(SERVICE_WORKER_ENTRY_PARAM);
  if (!raw) return null;

  try {
    const values: unknown = JSON.parse(raw);
    if (!Array.isArray(values) || values.length < 1 || values.length > 2) return null;
    const parents = values.map((value: unknown) => readInternalHref(value, url.origin));
    if (!parents.every((path): path is string => path !== null)) return null;

    const destination = new URL(url);
    destination.searchParams.delete(SERVICE_WORKER_ENTRY_PARAM);
    const href = `${destination.pathname}${destination.search}${destination.hash}`;
    if (parents.includes(href) || new Set(parents).size !== parents.length) return null;
    return { parents, href };
  } catch {
    return null;
  }
}

export function restoreServiceWorkerEntryHistory() {
  const entry = readServiceWorkerEntry(new URL(window.location.href));
  if (!entry) return;

  // 최초 엔트리를 교체해 알림 목적지가 히스토리 맨 아래 남지 않도록 처리
  window.history.replaceState(null, "", entry.parents[0]);
  for (const href of entry.parents.slice(1)) {
    window.history.pushState(null, "", href);
  }
  window.history.pushState(null, "", entry.href);
}
