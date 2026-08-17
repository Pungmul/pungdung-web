import { okEnvelope } from "../envelope";

export const E2E_NOTIFICATION_ID = 801;
export const E2E_NOTIFICATION_TITLE = "E2E 채팅 알림";

export const unreadNotificationItem = {
  id: E2E_NOTIFICATION_ID,
  receiverId: 1,
  token: "e2e-fcm-token",
  title: E2E_NOTIFICATION_TITLE,
  body: "새 메시지가 도착했습니다.",
  data: JSON.stringify({
    sentAt: "2027-12-01T00:00:00.000Z",
    chatRoomUUID: "e2e-chat-room",
  }),
  isRead: false,
  sentAt: "2027-12-01T00:00:00.000Z",
  status: "SENT",
  response: null,
  domainType: "CHAT",
};

export const unreadNotificationListResponse = okEnvelope([
  unreadNotificationItem,
]);

export const emptyUnreadNotificationListResponse = okEnvelope([]);
