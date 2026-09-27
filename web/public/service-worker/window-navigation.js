(() => {
  const NAVIGATE = "pungdung:sw:navigate";
  const ACK = "pungdung:sw:navigation-accepted";
  const ENTRY_PARAM = "__sw_navigation";
  const RESPONSE_TIMEOUT_MS = 2000;

  function requestNavigation(client, href) {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      const finish = (accepted) => {
        clearTimeout(timeout);
        channel.port1.close();
        resolve(accepted);
      };
      const timeout = setTimeout(() => finish(false), RESPONSE_TIMEOUT_MS);
      channel.port1.onmessage = (event) => {
        if (event.data?.type === ACK) finish(true);
      };
      try {
        client.postMessage({ type: NAVIGATE, href }, [channel.port2]);
      } catch {
        finish(false);
      }
    });
  }

  async function open(target) {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const candidates = windows.filter((client) =>
      new URL(client.url).origin === self.location.origin && client.frameType !== "nested"
    );
    const client = candidates.find((item) => item.focused) ??
      candidates.find((item) => item.visibilityState === "visible") ?? candidates[0];

    if (client) {
      await client.focus().catch(() => undefined);
      // 이동 정보 없는 기존 알림은 실행 중인 앱만 표시
      if (!target) return;
      if (await requestNavigation(client, target.href)) return;
      const navigated = await client.navigate(target.href).catch(() => null);
      if (!navigated) await self.clients.openWindow(target.href);
      return;
    }

    const href = target?.href ?? "/notification";
    const parents = target?.parents ?? ["/home"];
    const url = new URL(href, self.location.origin);
    url.searchParams.set(ENTRY_PARAM, JSON.stringify(parents));
    await self.clients.openWindow(url.href);
  }

  self.pungdungWindowNavigation = { open };
})();
