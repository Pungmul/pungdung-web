import {
  readNavigationMessage,
  SERVICE_WORKER_NAVIGATION_ACK,
} from "./navigation-contract";

export function subscribeToServiceWorkerNavigation(navigate: (href: string) => void) {
  if (!("serviceWorker" in navigator)) return () => {};

  const handleMessage = (event: MessageEvent<unknown>) => {
    if (event.origin !== window.location.origin) return;
    const source = event.source;
    if (!source || !("scriptURL" in source)) return;
    const workerUrl = new URL(source.scriptURL);
    if (
      workerUrl.origin !== window.location.origin ||
      workerUrl.pathname !== "/pungdung-sw.js"
    ) return;

    const href = readNavigationMessage(event.data, window.location.origin);
    if (!href) return;
    navigate(href);
    event.ports[0]?.postMessage({ type: SERVICE_WORKER_NAVIGATION_ACK });
  };

  navigator.serviceWorker.addEventListener("message", handleMessage);
  return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
}
