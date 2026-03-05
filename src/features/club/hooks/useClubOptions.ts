"use client";

import { useMemo } from "react";

import { SelectorItem } from "@/shared/components/form/Selector";

import { useClubList } from "../queries/useClubList";

export const useClubOptions = (): SelectorItem<number | null>[] => {
  const { data: clubList } = useClubList();

  return useMemo(
    () => [
      { label: "소속패 없음", value: null },
      ...clubList.map((club) => ({
        label: `${club.groupName} (${club.school})`,
        value: club.clubId,
      })),
    ],
    [clubList]
  );
};
