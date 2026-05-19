"use client";

import { useState } from "react";
import Image from "next/image";

import type { ReactNode } from "react";

import { cn } from "@/shared";

import type { LightningParticipantProfile } from "../../../types";

interface LightningParticipantBoxProps {
  profile: LightningParticipantProfile;
  isOrganizer?: boolean;
  className?: string;
  buttons?: ReactNode;
  onOpen?: () => void;
}

export function LightningParticipantBox({
  profile,
  isOrganizer = false,
  className,
  buttons,
  onOpen,
}: LightningParticipantBoxProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const imageUrl = profile.profileImage?.fullFilePath;
  const showImage = Boolean(imageUrl) && !hasImageError;
  const hasButtons = Boolean(buttons);
  const subtitle = profile.clubName?.trim() || "동아리 정보 없음";

  const handleActivate = () => {
    onOpen?.();
  };

  return (
    <div
      className={cn(
        "flex flex-row items-center p-2",
        hasButtons && "w-full gap-3",
        !hasButtons && "h-16 gap-4",
        !hasButtons && onOpen && "cursor-pointer",
        className
      )}
      onClick={hasButtons ? undefined : handleActivate}
    >
      <div
        role={hasButtons ? "button" : undefined}
        tabIndex={hasButtons ? 0 : undefined}
        className={cn(
          "flex min-w-0 flex-1 flex-row items-center gap-4",
          hasButtons && "outline-none",
          hasButtons && onOpen && "cursor-pointer"
        )}
        onClick={hasButtons ? handleActivate : undefined}
        onKeyDown={
          hasButtons
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleActivate();
                }
              }
            : undefined
        }
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-[8px] bg-grey-200">
          {showImage && imageUrl ? (
            <Image
              src={imageUrl}
              alt={profile.profileImage?.originalFilename || profile.name}
              fill
              className="object-cover object-center"
              onError={() => setHasImageError(true)}
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="truncate text-[13px] font-medium text-grey-800">
              {profile.name}
            </div>
            {isOrganizer && (
              <span className="shrink-0 rounded-[4px] bg-primary px-1.5 py-0.5 text-[10px] font-bold text-background">
                주최자
              </span>
            )}
          </div>
          <div className="truncate text-[11px] text-grey-400">{subtitle}</div>
          <div className="truncate text-[11px] text-grey-400">
            {profile.username}
          </div>
        </div>
      </div>
      {hasButtons && (
        <div
          className="flex shrink-0 flex-row items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {buttons}
        </div>
      )}
    </div>
  );
}
