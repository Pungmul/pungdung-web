"use client";
import { useCallback, useState } from "react";

import type { LocationType } from "@/features/location";

import { LocationMapPicker } from "./LocationMapPicker";
import { default as Modal } from "./Modal";
import type { Address } from "../../types";
import { Button } from "../buttons";

interface LocationModalProps {
  isLocationModalOpen: boolean;
  initialAddress?: LocationType | null;
  setIsLocationModalOpen: (isLocationModalOpen: boolean) => void;
  onSubmit: (location: Omit<Address, "detail">) => void;
  withSearchBar?: boolean;
}

export default function LocationModal({
  isLocationModalOpen,
  initialAddress,
  setIsLocationModalOpen,
  onSubmit,
  withSearchBar = false,
}: LocationModalProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(
    initialAddress ?? null
  );
  const [currentAddress, setCurrentAddress] = useState<string>("");

  const closeModal = useCallback(() => {
    setIsLocationModalOpen(false);
  }, [setIsLocationModalOpen]);

  const handleSubmit = useCallback(() => {
    if (currentLocation) {
      onSubmit({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        buildingName: currentAddress,
      });
      closeModal();
    }
  }, [onSubmit, currentLocation, currentAddress, closeModal]);

  const handleLocationChange = useCallback(
    (location: LocationType, address: string) => {
      setCurrentLocation(location);
      setCurrentAddress(address);
    },
    []
  );

  return (
    <Modal
      isOpen={isLocationModalOpen}
      title="주소 선택"
      onClose={closeModal}
      className="min-w-[200px] w-full max-w-[calc(100dvw-48px)] sm:max-w-md"
    >
      <div className="space-y-4">
        <LocationMapPicker
          initialLocation={initialAddress}
          onLocationChange={handleLocationChange}
          showSearchBar={withSearchBar}
        />

        <div className="flex space-x-2">
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-primary text-background"
          >
            확인
          </Button>
          <Button
            type="button"
            onClick={closeModal}
            className="!bg-background border border-grey-500 text-grey-500"
          >
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}
