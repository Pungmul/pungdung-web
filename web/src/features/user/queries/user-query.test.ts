import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchUserProfileCardDetailByUsername } from "../api/client/fetch-user-info-by-username.api";
import { userQueries } from "./user-query";

vi.mock("../api/client/fetch-user-info-by-username.api", () => ({
  fetchUserProfileCardDetailByUsername: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("userQueries", () => {
  it("detailByUsername 키는 all 접두를 유지하고 username을 포함한다", () => {
    const all = userQueries.all().queryKey;
    const detailOpts = userQueries.detailByUsername("u");
    const key = detailOpts.queryKey;

    expect(key).toEqual([...all, "u"]);
    expect(key.slice(0, all.length)).toEqual(all);
    expect(key).toContain("u");
  });
});

describe("userQueries.detailByUsername", () => {
  it("fetch 결과가 null이면 USER_PROFILE_DETAIL_FETCH_FAILED 에러를 던진다", async () => {
    const mockedFetch = vi.mocked(fetchUserProfileCardDetailByUsername);
    mockedFetch.mockResolvedValueOnce(null);

    const options = userQueries.detailByUsername("u");
    const queryFn = options.queryFn as () => Promise<unknown>;

    await expect(queryFn()).rejects.toThrowError(
      new Error("USER_PROFILE_DETAIL_FETCH_FAILED"),
    );
  });

  it("fetch 결과가 객체면 동일 객체를 반환한다", async () => {
    const mockedFetch = vi.mocked(fetchUserProfileCardDetailByUsername);
    const detail = {
      profileImage: null,
      clubName: "프론트엔드",
      school: "한빛대학교",
      groupName: "개발동아리",
      email: "user@example.com",
      clubAge: 2,
    };
    mockedFetch.mockResolvedValueOnce(detail);

    const options = userQueries.detailByUsername("u");
    const queryFn = options.queryFn as () => Promise<unknown>;

    await expect(queryFn()).resolves.toEqual(detail);
  });
});
