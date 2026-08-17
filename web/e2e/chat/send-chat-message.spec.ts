import { expect, test } from "@playwright/test";

import {
  chatTimelineEnvelope,
  E2E_CHAT_ROOM_A,
  E2E_CHAT_USERNAME,
  E2E_RETRY_TEXT,
  E2E_SEND_TEXT,
} from "../fixtures/chat/responses";
import { mockChatHttp } from "../helpers/chat-route-mocks";
import { installStompWsMock } from "../helpers/stomp-ws-mock";

test("CHAT-011 | 전송 실패 후 재전송하면 한 건만 확정된다", async ({ page }) => {
  const chatMock = await mockChatHttp(page, {
    roomId: E2E_CHAT_ROOM_A,
    sendFailsOnce: true,
  });
  const stomp = await installStompWsMock(page);

  await test.step("보내기에 실패하면 안내와 입력 내용이 남음", async () => {
    await page.goto(`/chats/r/${E2E_CHAT_ROOM_A}`);
    await stomp.waitForSubscription(`/sub/chat/message/${E2E_CHAT_ROOM_A}`);
    await page.getByRole("textbox", { name: "메시지", exact: true }).fill(
      E2E_RETRY_TEXT
    );
    await page.getByRole("button", { name: "보내기", exact: true }).click();
    await expect(
      page.getByText("채팅 전송에 실패했습니다.", { exact: true })
    ).toBeVisible();
    await expect(page.getByText(E2E_RETRY_TEXT, { exact: true })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/chats/r/${E2E_CHAT_ROOM_A}`));
  });

  await test.step("실패 메시지에서 다시 보내면 echo 후 한 건만 남음", async () => {
    await page
      .getByRole("button", { name: "메시지 다시 보내기", exact: true })
      .click();
    await expect
      .poll(() => chatMock.lastTextClientId())
      .not.toBeNull();
    const clientId = chatMock.lastTextClientId();
    stomp.publish(
      `/sub/chat/message/${E2E_CHAT_ROOM_A}`,
      chatTimelineEnvelope({
        id: 31,
        roomId: E2E_CHAT_ROOM_A,
        content: E2E_RETRY_TEXT,
        senderUsername: E2E_CHAT_USERNAME,
        clientId,
      })
    );
    await expect(page.getByText(E2E_RETRY_TEXT, { exact: true })).toHaveCount(1);
    await expect(page.getByText("전송중", { exact: true })).toHaveCount(0);
  });
});

test("CHAT-003 | 텍스트를 보내면 echo 후 재진입에도 남는다", async ({ page }) => {
  const chatMock = await mockChatHttp(page, { roomId: E2E_CHAT_ROOM_A });
  const stomp = await installStompWsMock(page);

  await test.step("전송 후 소켓 echo로 한 건이 확정됨", async () => {
    await page.goto(`/chats/r/${E2E_CHAT_ROOM_A}`);
    await stomp.waitForSubscription(`/sub/chat/message/${E2E_CHAT_ROOM_A}`);
    await page.getByRole("textbox", { name: "메시지", exact: true }).fill(
      E2E_SEND_TEXT
    );
    await page.getByRole("button", { name: "보내기", exact: true }).click();
    await expect
      .poll(() => chatMock.lastTextClientId())
      .not.toBeNull();
    stomp.publish(
      `/sub/chat/message/${E2E_CHAT_ROOM_A}`,
      chatTimelineEnvelope({
        id: 41,
        roomId: E2E_CHAT_ROOM_A,
        content: E2E_SEND_TEXT,
        senderUsername: E2E_CHAT_USERNAME,
        clientId: chatMock.lastTextClientId(),
      })
    );
    await expect(page.getByText(E2E_SEND_TEXT, { exact: true })).toHaveCount(1);
    await expect(page.getByText("전송중", { exact: true })).toHaveCount(0);
  });

  await test.step("같은 방에 다시 들어가면 보낸 내용이 히스토리에 있음", async () => {
    await page.goto(`/chats/r/${E2E_CHAT_ROOM_A}`);
    await expect(page.getByText(E2E_SEND_TEXT, { exact: true })).toBeVisible();
  });
});
