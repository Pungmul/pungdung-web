"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { lightningQueries } from "../../queries";
import { deriveDisplayLightningLists } from "../../services";
import type { LightningMeeting } from "../../types";

type UseLightningListsParams = {
  normalLightningMeetings?: LightningMeeting[] | null;
  schoolLightningMeetings?: LightningMeeting[] | null;
};

export const useLightningLists = ({
  normalLightningMeetings,
  schoolLightningMeetings,
}: UseLightningListsParams = {}) => {
  const { data } = useQuery(lightningQueries.lightningData());

  const resolvedMeetingsForDisplay = useMemo(
    () => ({
      normal:
        normalLightningMeetings ?? data?.normalLightningMeetings ?? [],
      school:
        schoolLightningMeetings ?? data?.schoolLightningMeetings ?? [],
    }),
    [data, normalLightningMeetings, schoolLightningMeetings]
  );

  const displayData = useMemo(
    () => ({
      normalLightningMeetings: resolvedMeetingsForDisplay.normal,
      schoolLightningMeetings: resolvedMeetingsForDisplay.school,
    }),
    [resolvedMeetingsForDisplay]
  );

  return useMemo(() => deriveDisplayLightningLists(displayData), [displayData]);
};
