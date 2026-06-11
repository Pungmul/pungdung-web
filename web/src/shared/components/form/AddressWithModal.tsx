"use client";

import { useState } from "react";

import type { LocationType } from "@/features/location";

import { cn } from "@/shared/lib";

import type { Address } from "../../types";
import ChipButton from "../buttons/ChipButton";
import LocationModal from "../ui/LocationModal";

type AddressWithModalProps = {
  label?: string;
  selectedLabel?: string;
  initialAddress?: LocationType | null;
  withSearchBar?: boolean;
  rowClassName?: string;
  actionButtonClassName?: string;
  onSelect: (location: Omit<Address, "detail">) => void;
};

export default function AddressWithModal({
  label = "주소",
  selectedLabel,
  initialAddress = null,
  withSearchBar = false,
  rowClassName = "",
  actionButtonClassName = "",
  onSelect,
}: AddressWithModalProps) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const hasAddress = Boolean(selectedLabel);
  const actionText = hasAddress ? "다시 선택" : "주소 선택";

  return (
    <>
      <div
        className={cn(
          "w-full flex flex-row justify-between items-center",
          rowClassName
        )}
      >
        <div className="text-[14px] text-grey-400 shrink-0 mr-2">{label}</div>
        {hasAddress ? (
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row text-pretty break-keep whitespace-pre-wrap">{selectedLabel}</div>
            <ChipButton
              filled={true}
              className={cn("shrink-0", actionButtonClassName)}
              onClick={() => setIsAddressModalOpen(true)}
            >
              {actionText}
            </ChipButton>
          </div>
        ) : (
          <ChipButton
            filled={false}
            className={cn("shrink-0", actionButtonClassName)}
            onClick={() => setIsAddressModalOpen(true)}
          >
            {actionText}
          </ChipButton>
        )}
      </div>
      <LocationModal
        isLocationModalOpen={isAddressModalOpen}
        initialAddress={initialAddress}
        setIsLocationModalOpen={setIsAddressModalOpen}
        onSubmit={onSelect}
        withSearchBar={withSearchBar}
      />
    </>
  );
}
