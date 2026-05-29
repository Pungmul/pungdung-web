import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildUserProfileOpenPayload } from "@/features/friends";

import { mergeMemberIntoUserForSelfModal, openUserProfileModal } from "./open-user-profile-modal";
import { userProfileModalStore } from "../store";

import type { Member, User } from "../types";

vi.mock("@/features/friends", () => ({
  buildUserProfileOpenPayload: vi.fn(),
}));

const user = (overrides: Partial<User> = {}): User =>
  ({
    userId: 1,
    username: "other@pungdung.com",
    name: "다른 사람",
    profileImage: null,
    ...overrides,
  }) as User;

const member = (overrides: Partial<Member> = {}): Member =>
  ({
    username: "me@pungdung.com",
    name: "나",
    phoneNumber: "010",
    email: "me@pungdung.com",
    profile: null,
    clubName: "패명",
    groupName: "동아리",
    ...overrides,
  }) as Member;

describe("mergeMemberIntoUserForSelfModal", () => {
  it("member의 패명·동아리를 self 모달 user에 병합한다", () => {
    expect(
      mergeMemberIntoUserForSelfModal(user({ username: "me@pungdung.com" }), member())
    ).toMatchObject({
      username: "me@pungdung.com",
      clubName: "패명",
      groupName: "동아리",
    });
  });
});

describe("openUserProfileModal", () => {
  beforeEach(() => {
    userProfileModalStore.getState().close();
    vi.mocked(buildUserProfileOpenPayload).mockReset();
  });

  it("myInfo가 없으면 모달을 열지 않는다", async () => {
    const openSpy = vi.spyOn(userProfileModalStore.getState(), "open");

    await openUserProfileModal(user(), undefined);

    expect(openSpy).not.toHaveBeenCalled();
  });

  it("본인이면 self relationship으로 연다", async () => {
    const openSpy = vi.spyOn(userProfileModalStore.getState(), "open");

    await openUserProfileModal(
      user({ username: "me@pungdung.com" }),
      member({ username: "me@pungdung.com" })
    );

    expect(buildUserProfileOpenPayload).not.toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith({
      user: expect.objectContaining({ username: "me@pungdung.com", groupName: "동아리" }),
      relationship: "self",
    });
  });

  it("타인이면 friends payload로 연다", async () => {
    const openSpy = vi.spyOn(userProfileModalStore.getState(), "open");
    vi.mocked(buildUserProfileOpenPayload).mockResolvedValue({
      user: user(),
      relationship: "friend",
    });

    await openUserProfileModal(user(), member());

    expect(buildUserProfileOpenPayload).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith({
      user: user(),
      relationship: "friend",
    });
  });
});
