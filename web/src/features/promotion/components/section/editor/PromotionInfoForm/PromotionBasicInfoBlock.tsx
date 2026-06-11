"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Input } from "@/shared";
import { AddressWithModal } from "@/shared/components/form";

import type { PromotionPostingFormValues } from "../../../../types/promotion-posting-form.types";

/**
 * 기본 정보 블록 — 제목, 주소, 상세주소 필드.
 */
export const PromotionBasicInfoBlock = () => {
  const { control } = useFormContext<PromotionPostingFormValues>();

  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            label="제목"
            placeholder="제목을 입력해주세요."
            className="w-full"
            type="text"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <>
            <AddressWithModal
              rowClassName="px-1"
              actionButtonClassName="bg-grey-800 text-background border-grey-800"
              selectedLabel={field.value?.buildingName || ""}
              initialAddress={
                field.value &&
                typeof field.value.latitude === "number" &&
                typeof field.value.longitude === "number" &&
                Number.isFinite(field.value.latitude) &&
                Number.isFinite(field.value.longitude) &&
                !(field.value.latitude === 0 && field.value.longitude === 0)
                  ? {
                      latitude: field.value.latitude,
                      longitude: field.value.longitude,
                    }
                  : null
              }
              onSelect={(location) => {
                field.onChange({
                  ...location,
                  detail: "",
                  buildingName: location.buildingName || "",
                });
              }}
              withSearchBar={true}
            />
            <Input
              label="상세주소"
              placeholder="상세주소를 입력해주세요."
              className="w-full"
              type="text"
              value={field.value?.detail || ""}
              onChange={(e) => {
                const detailAddress = e.target.value;
                field.onChange(
                  field.value
                    ? { ...field.value, detail: detailAddress }
                    : {
                      latitude: 0,
                      longitude: 0,
                      detail: detailAddress,
                      buildingName: "",
                    }
                );
              }}
            />
          </>
        )}
      />
    </>
  );
};
