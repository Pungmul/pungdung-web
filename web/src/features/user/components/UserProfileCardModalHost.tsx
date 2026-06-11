"use client";

import React from "react";
import { createPortal } from "react-dom";

import { userProfileModalStore } from "../store";

import { UserProfileCardModal } from "./UserProfileCardModal";

/** 친구·채팅 화면에서 프로필 모달(스토어 구독)을 한 번 마운트한다. */
export function UserProfileCardModalHost() {
  const isOpen = userProfileModalStore((s) => s.isOpen);
  const user = userProfileModalStore((s) => s.user);

  if (typeof document === "undefined" || !isOpen || !user) {
    return null;
  }

  return createPortal(<UserProfileCardModal />, document.body);
}
