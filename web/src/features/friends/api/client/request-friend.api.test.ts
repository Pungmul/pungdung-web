import { beforeEach, describe, expect, it } from "vitest";

import { friendsApiHandlers } from "@/app/api/friends/__mock__/handlers";
import { server } from "@/test/msw-server";

import { requestFriend } from "./request-friend.api";

describe("requestFriend", () => {
  beforeEach(() => {
    server.resetHandlers();
    server.use(...friendsApiHandlers);
  });

  it("resolves on envelope success", async () => {
    await expect(requestFriend("someone")).resolves.toBeUndefined();
  });
});
