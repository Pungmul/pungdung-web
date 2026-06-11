import { beforeEach, describe, expect, it } from "vitest";

import { friendsApiHandlers } from "@/app/api/friends/__mock__/handlers";
import { server } from "@/test/msw-server";

import { fetchFriendsSearch } from "./fetch-friends-search.api";

describe("fetchFriendsSearch", () => {
  beforeEach(() => {
    server.resetHandlers();
    server.use(...friendsApiHandlers);
  });

  it("returns list for keyword", async () => {
    const list = await fetchFriendsSearch("hello");
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list[0]?.user.username).toBe("testuser");
  });
});
