"use client";

import { create } from "zustand";

import type { User } from "../types/user.types";

/** 프로필 카드 하단 액션용 관계 (수신 요청은 수락 버튼으로 처리) */
export type UserProfileRelationship =
  | "none"
  | "pending_out"
  | "pending_in"
  | "friend"
  /** 본인 프로필 보기 — 하단 친구/채팅 CTA 없음 */
  | "self";

export type OpenUserProfilePayload = {
  user: User;
  relationship: UserProfileRelationship;
  /** relationship이 pending_in일 때 수락 API에 전달 */
  incomingFriendRequestId?: number | null;
};

type UserProfileModalState = {
  isOpen: boolean;
  user: User | null;
  relationship: UserProfileRelationship;
  incomingFriendRequestId: number | null;
  open: (payload: OpenUserProfilePayload) => void;
  close: () => void;
};

export const userProfileModalStore = create<UserProfileModalState>((set) => ({
  isOpen: false,
  user: null,
  relationship: "none",
  incomingFriendRequestId: null,

  open: ({
    user,
    relationship,
    incomingFriendRequestId = null,
  }: OpenUserProfilePayload) => {
    set({
      isOpen: true,
      user,
      relationship,
      incomingFriendRequestId: incomingFriendRequestId ?? null,
    });
  },

  close: () => {
    set({
      isOpen: false,
      user: null,
      relationship: "none",
      incomingFriendRequestId: null,
    });
  },
}));
