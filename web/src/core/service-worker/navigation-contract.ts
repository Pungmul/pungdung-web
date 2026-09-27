export const SERVICE_WORKER_NAVIGATE = "pungdung:sw:navigate";
export const SERVICE_WORKER_NAVIGATION_ACK = "pungdung:sw:navigation-accepted";
export const SERVICE_WORKER_ENTRY_PARAM = "__sw_navigation";

export function readInternalHref(value: unknown, origin: string): string | null {
  if (
    typeof value !== "string" || !value.startsWith("/") ||
    value.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(value)
  ) return null;

  const url = new URL(value, origin);
  return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : null;
}

export function readNavigationMessage(data: unknown, origin: string): string | null {
  if (
    typeof data !== "object" || data === null ||
    !("type" in data) || data.type !== SERVICE_WORKER_NAVIGATE ||
    !("href" in data)
  ) return null;

  return readInternalHref(data.href, origin);
}
