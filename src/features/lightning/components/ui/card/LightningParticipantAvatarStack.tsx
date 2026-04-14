"use client";

import { useState } from "react";

import Image from "next/image";

import { cn } from "@/shared";

import { getLightningParticipantDisplay } from "../../../lib/get-lightning-participant-display";
import type { LightningParticipantProfile } from "../../../types";

interface LightningParticipantAvatarStackProps {
  participantProfiles: LightningParticipantProfile[];
  currentPersonNum: number;
  maxVisible?: number;
  overflowTextClassName?: string;
}

export function LightningParticipantAvatarStack({
  participantProfiles,
  currentPersonNum,
  maxVisible = 5,
  overflowTextClassName = "text-[14px] font-normal tracking-[0.5px] text-grey-500",
}: LightningParticipantAvatarStackProps) {
  const { visibleProfiles, placeholderCount, overflowCount } =
    getLightningParticipantDisplay({
      participantProfiles,
      currentPersonNum,
      maxVisible,
    });

  return (
    <div className="flex items-center gap-[8px]">
      <div className="flex items-center" aria-hidden>
        {visibleProfiles.map((profile, index) => (
          <span
            key={`lightning-participant-${profile.userId}`}
            className={index > 0 ? "-ml-[4px]" : undefined}
          >
            <ParticipantAvatar profile={profile} />
          </span>
        ))}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <span
            key={`lightning-participant-placeholder-${index}`}
            className={cn(
              "relative inline-block shrink-0 overflow-hidden border-background bg-grey-200 size-[32px] rounded-[12px] border-[1.5px]",
              index > 0 && "-ml-[4px]"
            )}
          />
        ))}
      </div>
      {overflowCount > 0 && (
        <span className={overflowTextClassName}>+{overflowCount}</span>
      )}
    </div>
  );
}

function ParticipantAvatar({
  profile,
}: {
  profile: LightningParticipantProfile;
}) {
  const imageUrl = profile.profileImage?.fullFilePath;
  const [hasImageError, setHasImageError] = useState(false);
  const showImage = Boolean(imageUrl) && !hasImageError;

  return (
    <span className="size-8 relative inline-block shrink-0 overflow-hidden border-background bg-grey-200 rounded-[12px] border-[1.5px]">
      {showImage && imageUrl ? (
        <Image
          src={imageUrl}
          alt={profile.name}
          fill
          className="size-full object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : null}
    </span>
  );
}
