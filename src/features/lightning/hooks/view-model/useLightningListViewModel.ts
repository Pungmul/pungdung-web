"use client";

import { useMemo, useState } from "react";

import { filterLightningList } from "../../services";
import type { LightningMeeting } from "../../types";

interface UseLightningListViewModelProps {
  wholeLightningList: LightningMeeting[];
  schoolLightningList: LightningMeeting[];
}

export const useLightningListViewModel = ({
  wholeLightningList,
  schoolLightningList,
}: UseLightningListViewModelProps) => {
  const [target, setTarget] = useState<"전체" | "우리학교">("전체");

  const lightningList = useMemo(
    () => filterLightningList(target, wholeLightningList, schoolLightningList),
    [target, wholeLightningList, schoolLightningList]
  );

  return {
    lightningList,
    setTarget,
    target,
  };
};
