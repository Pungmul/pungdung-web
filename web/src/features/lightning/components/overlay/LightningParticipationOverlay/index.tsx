"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { AnimatePresence } from "framer-motion";

import { ParticipationDetailOverlay } from "./ParticipationDetailOverlay";
import { ParticipationFloatingBadge } from "./ParticipationFloatingBadge";
import { useLightningParticipationTimeDisplay } from "../../../hooks/view-model/useLightningParticipationTimeDisplay";
import { lightningQueries } from "../../../queries";

export function LightningParticipationOverlay() {
  const { data: userPartinLightning } = useQuery(
    lightningQueries.participationStatus()
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const participationData =
    userPartinLightning?.participant === true &&
      userPartinLightning.lightningMeeting
      ? {
        ...userPartinLightning,
        lightningMeeting: userPartinLightning.lightningMeeting,
      }
      : null;
  const participationMeeting = participationData?.lightningMeeting ?? null;
  const participationTimeDisplay =
    useLightningParticipationTimeDisplay(participationMeeting);

  if (!participationMeeting) {
    return null;
  }

  return (
    <>
      <ParticipationFloatingBadge
        meeting={participationMeeting}
        subText={participationTimeDisplay.subText}
        statusLabel={participationTimeDisplay.statusLabel}
        onDetailOpen={() => setIsDetailOpen(true)}
      />
      <AnimatePresence>
        {isDetailOpen && (
          <ParticipationDetailOverlay
            participationData={participationData!}
            onClose={() => setIsDetailOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
