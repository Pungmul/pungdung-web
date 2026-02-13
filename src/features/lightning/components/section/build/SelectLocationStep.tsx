"use client";

import { BottomFixedButton, Input } from "@/shared";
import { LocationMapPicker } from "@/shared/components/ui";

import { useSelectLocationStepForm } from "../../../hooks/form";

export function SelectLocationStep() {
  const {
    detailAddress,
    handleLocationChange,
    initialLocation,
    submitSelectLocationStep,
    updateDetailAddress,
  } = useSelectLocationStepForm();

  return (
    <>
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto space-y-4">
        <LocationMapPicker
          initialLocation={initialLocation}
          onLocationChange={handleLocationChange}
          showSearchBar={true}
        />

        {/* 상세 주소 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-grey-700">상세 주소</label>
          <Input
            value={detailAddress}
            placeholder="상세 주소를 입력하세요 (예: 101동 202호)"
            onChange={(e) => updateDetailAddress(e.target.value)}
          />
        </div>
      </div>

      <BottomFixedButton
        onClick={() => {
          void submitSelectLocationStep();
        }}
      >
        다음
      </BottomFixedButton>
    </>
  );
}
