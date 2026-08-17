import { expect, test } from "@playwright/test";

import {
  chatTimelineEnvelope,
  E2E_CHAT_ROOM_A,
  E2E_HISTORY_TEXT,
  E2E_INCOMING_TEXT,
  E2E_OTHER_USERNAME,
} from "../fixtures/chat/responses";
import { mockChatHttp } from "../helpers/chat-route-mocks";
import { installStompWsMock } from "../helpers/stomp-ws-mock";

test("CHAT-001 | 채팅방에서 히스토리와 현재 방 메시지를 본다", async ({
  page,
}) => {
  await mockChatHttp(page, {
    roomId: E2E_CHAT_ROOM_A,
    withHistory: true,
  });
  const stomp = await installStompWsMock(page);

  await test.step("방에 들어가면 이전 대화가 보임", async () => {
    await page.goto(`/chats/r/${E2E_CHAT_ROOM_A}`);
    await expect(page.getByText(E2E_HISTORY_TEXT, { exact: true })).toBeVisible();
  });

  await test.step("현재 방 소켓 메시지만 타임라인에 붙음", async () => {
    const topic = `/sub/chat/message/${E2E_CHAT_ROOM_A}`;
    await stomp.waitForSubscription(topic);
    stomp.publish(
      topic,
      chatTimelineEnvelope({
        id: 20,
        roomId: E2E_CHAT_ROOM_A,
        content: E2E_INCOMING_TEXT,
        senderUsername: E2E_OTHER_USERNAME,
      })
    );
    await expect(page.getByText(E2E_INCOMING_TEXT, { exact: true })).toBeVisible();
    await expect(page.getByText(E2E_HISTORY_TEXT, { exact: true })).toBeVisible();
  });
});
