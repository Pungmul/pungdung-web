"use client";

import { useMemo } from "react";

import { SelectorItem } from "@/shared/components/form/Selector";

import type { ClubInfo } from "../types";

export const useClubOptions = (
  clubList: ClubInfo[],
): SelectorItem<number | null>[] =>
  useMemo(
    () => [
      { label: "소속패 없음", value: null },
      ...clubList.map((club) => ({
        label: `${club.groupName} (${club.school})`,
        value: club.clubId,
      })),
    ],
    [clubList],
  );
