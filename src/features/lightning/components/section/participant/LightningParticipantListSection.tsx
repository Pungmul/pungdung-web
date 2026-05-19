"use client";

import { useCallback, useMemo, useState } from "react";

import {
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { SearchInput } from "@/shared";
import { Toast } from "@/shared/store";

import type { LightningParticipantProfile } from "../../../types";
import { LightningParticipantBox } from "../../ui/participant/LightningParticipantBox";
import { LightningParticipantMenu } from "../../ui/participant/LightningParticipantMenu";
import { LightningParticipantMessageButton } from "../../ui/participant/LightningParticipantMessageButton";

interface LightningParticipantListSectionProps {
  meetingId: number;
  organizerId: number;
  participantProfiles: LightningParticipantProfile[];
  currentPersonNum: number;
  hasChatRoom: boolean;
  onMoveToChat: () => void;
}

export function LightningParticipantListSection({
  meetingId,
  organizerId,
  participantProfiles,
  currentPersonNum,
  hasChatRoom,
  onMoveToChat,
}: LightningParticipantListSectionProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProfiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return participantProfiles;
    }

    return participantProfiles.filter((profile) => {
      const clubName = profile.clubName?.toLowerCase() ?? "";
      return (
        profile.name.toLowerCase().includes(query) ||
        profile.username.toLowerCase().includes(query) ||
        clubName.includes(query)
      );
    });
  }, [participantProfiles, searchQuery]);

  const handleMenuReport = useCallback(() => {
    Toast.show({
      message: "신고 기능은 준비 중입니다.",
      type: "warning",
    });
  }, []);

  return (
    <section className="flex flex-col flex-1">
      <div className="flex items-center justify-between py-2">
        <h3 className="flex items-center gap-1">
          <span className="text-base font-normal text-grey-800">참여한 사람들</span>
          <span className="text-xs text-grey-500 tracking-[-0.12%]">({currentPersonNum} 명)</span>
        </h3>
        <button
          type="button"
          aria-label={isSearching ? "검색 닫기" : "참여자 검색"}
          className="flex size-6 items-center justify-center text-grey-500"
          onClick={() => {
            setIsSearching((prev) => {
              if (prev) {
                setSearchQuery("");
              }
              return !prev;
            });
          }}
        >
          {isSearching ? (
            <XMarkIcon className="size-8 stroke-[2px]" />
          ) : (
            <MagnifyingGlassIcon className="size-9 stroke-[2px]" />
          )}
        </button>
      </div>

      {isSearching && (
        <SearchInput
          autoFocus
          placeholder="검색어를 입력해주세요."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onClose={() => {
            setSearchQuery("");
            setIsSearching(false);
          }}
        />
      )}

      {filteredProfiles.length === 0 ? (
        <p className="py-8 text-center text-sm text-grey-500 flex-1 flex justify-center items-center">
          {searchQuery.trim()
            ? "검색 결과가 없습니다."
            : "아직 참여자 정보가 없습니다."}
        </p>
      ) : (
        <div className="flex flex-col flex-1">
          {filteredProfiles.map((profile) => (
            <LightningParticipantBox
              key={`lightning-participant-${meetingId}-${profile.userId}`}
              className="hover:bg-grey-100 max-md:px-1"
              profile={profile}
              isOrganizer={profile.userId === organizerId}
              buttons={
                <>
                  {hasChatRoom && (
                    <LightningParticipantMessageButton onClick={onMoveToChat} />
                  )}
                  <LightningParticipantMenu
                    items={[
                      {
                        label: "신고",
                        handler: handleMenuReport,
                        className: "text-red-400",
                      },
                    ]}
                  />
                </>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
