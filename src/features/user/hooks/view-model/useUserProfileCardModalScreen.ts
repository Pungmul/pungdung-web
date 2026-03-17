"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { normalizeUserForProfileModal } from "../../lib";
import { formatDetailCell, formatSchoolClubLine } from "../../lib";
import { userQueries } from "../../queries";
import { userProfileModalStore } from "../../store";
import { useModalEscapeKey } from "../state";

type HiddenScreenState = {
  isVisible: false;
};

type VisibleScreenState = {
  isVisible: true;
  relationship: ReturnType<
    typeof userProfileModalStore.getState
  >["relationship"];
  user: NonNullable<ReturnType<typeof userProfileModalStore.getState>["user"]>;
  profileSrc: string | undefined;
  profileAlt: string;
  displayName: string;
  nicknameLine: string;
  schoolClubLine: string;
  emailLine: string;
  avatarInitial: string;
  isError: boolean;
  incomingFriendRequestId: number | null;
  close: () => void;
};

type UserProfileCardModalScreen = HiddenScreenState | VisibleScreenState;

export function useUserProfileCardModalScreen(): UserProfileCardModalScreen {
  const isOpen = userProfileModalStore((state) => state.isOpen);
  const rawUser = userProfileModalStore((state) => state.user);
  const relationship = userProfileModalStore((state) => state.relationship);
  const incomingFriendRequestId = userProfileModalStore(
    (state) => state.incomingFriendRequestId
  );
  const close = userProfileModalStore((state) => state.close);

  const user = useMemo(
    () => (rawUser ? normalizeUserForProfileModal(rawUser) : null),
    [rawUser]
  );
  const username = user?.username ?? "";

  const {
    data: detail,
    isPending,
    isError,
  } = useQuery({
    ...userQueries.detailByUsername(username),
    enabled: isOpen && user != null,
  });

  const isLoadingDetail = isPending && !isError;

  // ESC 닫기 사이드이펙트를 상태 훅으로 분리해 화면 모델 로직에 집중한다.
  useModalEscapeKey({ enabled: isOpen, onEscape: close });

  if (!isOpen || user == null) {
    return { isVisible: false };
  }

  const profileSrc =
    detail?.profileImage?.fullFilePath ?? user.profileImage?.fullFilePath;
  const displayName = user.name;
  const nicknameLine = formatDetailCell(isLoadingDetail, detail?.clubName);
  const schoolClubLine = formatSchoolClubLine(
    isLoadingDetail,
    detail?.school,
    detail?.groupName
  );
  const emailLine = formatDetailCell(isLoadingDetail, detail?.email);
  const avatarInitial =
    Array.from((displayName || user.username).trim() || "?")[0] ?? "?";
  const profileAlt =
    detail?.profileImage?.originalFilename ??
    user.profileImage?.originalFilename ??
    user.name;

  return {
    isVisible: true,
    relationship,
    user,
    profileSrc,
    profileAlt,
    displayName,
    nicknameLine,
    schoolClubLine,
    emailLine,
    avatarInitial,
    isError,
    incomingFriendRequestId,
    close,
  };
}
