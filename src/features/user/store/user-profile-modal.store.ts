"use client";

import { create } from "zustand";

import type { User } from "../types/user.types";
import type {
  OpenUserProfilePayload,
  UserProfileRelationship,
} from "../types/user-profile-modal.types";

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
