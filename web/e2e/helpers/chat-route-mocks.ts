import type { Page } from "@playwright/test";

import { mockAppShellHttp } from "./route-mocks";
import {
  chatLogResponse,
  chatNotificationStateResponse,
  chatRoomInfoResponse,
  chatRoomListResponse,
  chatTextMessageDto,
  E2E_CHAT_ROOM_A,
  E2E_CHAT_USERNAME,
  E2E_HISTORY_TEXT,
} from "../fixtures/chat/responses";
import { failEnvelope, okEnvelope } from "../fixtures/envelope";

export type ChatRouteMockOptions = {
  skipAppShell?: boolean;
  sendFailsOnce?: boolean;
  roomId?: string;
  roomName?: string;
  withHistory?: boolean;
};

export type ChatRouteMock = {
  lastTextClientId: () => string | null;
};

function apiPathname(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

export async function mockChatHttp(
  page: Page,
  options: ChatRouteMockOptions = {}
): Promise<ChatRouteMock> {
  const roomId = options.roomId ?? E2E_CHAT_ROOM_A;
  const roomName = options.roomName ?? "E2E 채팅방";
  let sendFailRemaining = options.sendFailsOnce ? 1 : 0;
  let lastTextClientId: string | null = null;
  let nextMessageId = options.withHistory ? 2 : 1;
  const messages = options.withHistory
    ? [
        chatTextMessageDto({
          id: 1,
          roomId,
          content: E2E_HISTORY_TEXT,
          senderUsername: "other-user",
        }),
      ]
    : [];

  if (!options.skipAppShell) {
    await mockAppShellHttp(page);
  }

  await page.route("**/api/chats/**", async (route) => {
    const method = route.request().method();
    const path = apiPathname(route.request().url());

    if (path === "/api/chats/roomlist") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(
          chatRoomListResponse([
            {
              roomId,
              roomName,
              lastMessage: messages.at(-1)?.content ?? null,
            },
          ])
        ),
      });
      return;
    }

    if (path.endsWith("/notification") && method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(chatNotificationStateResponse()),
      });
      return;
    }

    if (path.endsWith("/info") && method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(
          chatRoomInfoResponse({
            roomId,
            roomName,
            messages,
          })
        ),
      });
      return;
    }

    if (path.includes("/chatlog") && method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(chatLogResponse(messages)),
      });
      return;
    }

    if (path.endsWith("/text") && method === "POST") {
      const body = route.request().postDataJSON() as {
        content?: string;
        clientId?: string;
      };
      lastTextClientId = body.clientId ?? null;

      if (sendFailRemaining > 0) {
        sendFailRemaining -= 1;
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify(failEnvelope("채팅 전송에 실패했습니다.")),
        });
        return;
      }

      messages.push(
        chatTextMessageDto({
          id: nextMessageId,
          roomId,
          content: body.content ?? "",
          senderUsername: E2E_CHAT_USERNAME,
          clientId: body.clientId ?? null,
        })
      );
      nextMessageId += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(okEnvelope(null)),
      });
      return;
    }

    await route.fallback();
  });

  return {
    lastTextClientId: () => lastTextClientId,
  };
}
