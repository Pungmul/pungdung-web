"use client";

import { BottomFixedButton, Input } from "@/shared";
import { WarningCircleIcon } from "@/shared/components/Icons";
import { LocationMapPicker } from "@/shared/components/ui";

import { LIGHTNING_CREATE_FORM_FIELD } from "../../../constants";
import { useSelectLocationStepForm } from "../../../hooks/form";

const F = LIGHTNING_CREATE_FORM_FIELD;

export function SelectLocationStep() {
  const {
    detailAddress,
    fieldErrors,
    handleLocationChange,
    initialLocation,
    isNextDisabled,
    submitSelectLocationStep,
    updateDetailAddress,
  } = useSelectLocationStepForm();

  const locationBlockError =
    fieldErrors[F.ADDRESS] ?? fieldErrors[F.LOCATION_POINT];

  return (
    <>
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto space-y-4">
        <div className="flex flex-col gap-1">
          <LocationMapPicker
            initialLocation={initialLocation}
            onLocationChange={handleLocationChange}
            showSearchBar={true}
          />
          {locationBlockError ? (
            <div className="flex flex-row items-center gap-[4px] px-1">
              <span className="flex size-4 shrink-0 items-center justify-center"><WarningCircleIcon className="size-full text-red-400" /></span>
              <p className="text-[12px] text-red-500">{locationBlockError}</p>
            </div>
          ) : null}
        </div>

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
        disabled={isNextDisabled}
        onClick={() => {
          void submitSelectLocationStep();
        }}
      >
        다음
      </BottomFixedButton>
    </>
  );
}
