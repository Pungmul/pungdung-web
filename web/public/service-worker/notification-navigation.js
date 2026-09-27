(() => {
  const text = (value) => typeof value === "string" ? value.trim() : "";

  function resolveTarget(data) {
    const type = text(data?.type);
    const relatedId = text(data?.relatedId);
    const chatRoomUUID = text(data?.chatRoomUUID);

    // 일반 채팅은 type/relatedId 없이 채팅방 UUID로 전달됨
    if (!type && chatRoomUUID) {
      return { href: `/chats/r/${encodeURIComponent(chatRoomUUID)}`, parents: ["/home"] };
    }
    if (!relatedId) return null;

    if (type === "POST" && /^[1-9]\d*$/.test(relatedId)) {
      return { href: `/board/d/${relatedId}`, parents: ["/home", "/board/main"] };
    }
    if (type === "PERFORMANCE") {
      return { href: `/board/promote/d/${encodeURIComponent(relatedId)}`, parents: ["/home"] };
    }
    if (type === "LIGHTNING_MEETING") {
      return {
        href: chatRoomUUID ? `/chats/r/${encodeURIComponent(chatRoomUUID)}` : "/lightning",
        parents: ["/home"],
      };
    }
    return null;
  }

  self.addEventListener("notificationclick", (event) => {
    const notificationData = event.notification.data;
    // Firebase 자동 표시 알림과 data-only 직접 표시 알림만 처리
    if (!notificationData?.FCM_MSG && !notificationData?.pungdungFCM) return;
    if (event.action) return;

    event.stopImmediatePropagation();
    event.notification.close();
    const data = notificationData.FCM_MSG?.data ?? notificationData.pungdungFCM;
    event.waitUntil(self.pungdungWindowNavigation.open(resolveTarget(data)));
  });
})();
