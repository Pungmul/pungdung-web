"use client";

import { useCallback } from "react";

import { useQuery } from "@tanstack/react-query";

import { myPageQueries } from "@/features/my-page";
import { openUserProfileModal } from "@/features/user";

import { mapLightningParticipantProfileToUser } from "../../lib/mappers/map-lightning-participant-profile-to-user";
import type { LightningParticipantProfile } from "../../types";

/** 번개 참여자 카드에서 프로필 모달을 연다. */
export function useLightningParticipantProfileClick() {
  const { data: myInfo } = useQuery(myPageQueries.info());

  const openParticipantProfile = useCallback(
    async (profile: LightningParticipantProfile) => {
      await openUserProfileModal(
        mapLightningParticipantProfileToUser(profile),
        myInfo
      );
    },
    [myInfo]
  );

  return { openParticipantProfile };
}
