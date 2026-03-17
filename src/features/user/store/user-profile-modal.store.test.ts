import { beforeEach, describe, expect, it } from "vitest";

import type { User } from "../types/user.types";
import { userProfileModalStore } from "./user-profile-modal.store";

function createUser(): User {
  return {
    userId: 7,
    username: "user-7",
    name: "테스트 유저",
    clubName: "코딩 동아리",
    groupName: "백엔드",
    profileImage: {
      id: 1,
      originalFilename: "original.png",
      convertedFileName: "converted.png",
      fullFilePath: "/profiles/1.png",
      fileType: "image/png",
      fileSize: 10,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  };
}

function resetModalState() {
  userProfileModalStore.getState().close();
  userProfileModalStore.setState({
    isOpen: false,
    user: null,
    relationship: "none",
    incomingFriendRequestId: null,
  });
}

describe("userProfileModalStore", () => {
  beforeEach(() => {
    resetModalState();
  });

  it("초기 상태는 닫힘 상태와 기본 필드를 가진다", () => {
    const state = userProfileModalStore.getState();

    expect(state.isOpen).toBe(false);
    expect(state.user).toBeNull();
    expect(state.relationship).toBe("none");
    expect(state.incomingFriendRequestId).toBeNull();
  });

  it("open은 모달을 열고 user/relationship/incomingFriendRequestId를 설정한다", () => {
    const user = createUser();

    userProfileModalStore.getState().open({
      user,
      relationship: "pending_in",
      incomingFriendRequestId: 123,
    });

    const state = userProfileModalStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.relationship).toBe("pending_in");
    expect(state.incomingFriendRequestId).toBe(123);
  });

  it("open에서 incomingFriendRequestId를 생략하면 null로 저장한다", () => {
    const user = createUser();

    userProfileModalStore.getState().open({
      user,
      relationship: "friend",
    });
    expect(userProfileModalStore.getState().incomingFriendRequestId).toBeNull();
  });

  it("close는 상태를 초기값으로 되돌린다", () => {
    const user = createUser();
    userProfileModalStore.getState().open({
      user,
      relationship: "pending_in",
      incomingFriendRequestId: 77,
    });

    userProfileModalStore.getState().close();

    const state = userProfileModalStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.user).toBeNull();
    expect(state.relationship).toBe("none");
    expect(state.incomingFriendRequestId).toBeNull();
  });
});
