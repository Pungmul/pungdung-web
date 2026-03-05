"use client";
import { useMemo } from "react";

import type { ClubInfo } from "@/features/club";

import { createEditProfileSchema } from "@/features/my-page/types";

export const useEditProfileSchema = (clubList?: ClubInfo[]) => {
  return useMemo(() => {
    const clubIds = clubList?.map((club) => club.clubId) ?? [];
    return createEditProfileSchema(clubIds);
  }, [clubList]);
};
