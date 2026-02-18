"use client";

import React from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { CheckIcon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";

import { cn } from "@/shared/lib";
import { Toast } from "@/shared/store";

import {
  POST_EDITOR_MAX_IMAGE_COUNT,
  POST_EDITOR_MAX_SINGLE_IMAGE_BYTES,
} from "../../constants/post-image-upload-limits";
import type { PostEditorFormValues } from "../../types/schemas";

export function PostFooter({
  interactionsDisabled,
}: {
  interactionsDisabled?: boolean;
}) {
  const { control, setValue } = useFormContext<PostEditorFormValues>();

  const imageFiles = useWatch({ control, name: "imageFiles" });
  const anonymity = useWatch({ control, name: "anonymity" });

  return (
    <div className="sticky bg-background bottom-0 left-0 right-0 flex flex-row w-full items-center justify-between px-4 z-10 py-[12px] flex-shrink-0">
      <div className="flex">
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          multiple
          disabled={Boolean(interactionsDisabled)}
          className="hidden"
          onChange={(e) => {
            if (e.target.files === null || e.target.files.length === 0) {
              return;
            }

            const picked = Array.from(e.target.files);
            const tooLarge = picked.filter(
              (f) => f.size > POST_EDITOR_MAX_SINGLE_IMAGE_BYTES
            );
            if (tooLarge.length > 0) {
              Toast.show({
                message: "각 사진은 10MB 이하만 첨부할 수 있어요.",
                type: "error",
                duration: 3000,
              });
            }

            const withinSize = picked.filter(
              (f) => f.size <= POST_EDITOR_MAX_SINGLE_IMAGE_BYTES
            );
            const currentCount = imageFiles?.length ?? 0;
            const remainingSlots = POST_EDITOR_MAX_IMAGE_COUNT - currentCount;

            if (remainingSlots <= 0) {
              Toast.show({
                message: `사진은 최대 ${POST_EDITOR_MAX_IMAGE_COUNT}장까지 첨부할 수 있어요.`,
                type: "error",
                duration: 3000,
              });
              e.currentTarget.value = "";
              return;
            }

            const accepted = withinSize.slice(0, remainingSlots);
            if (accepted.length < withinSize.length) {
              Toast.show({
                message: `사진은 최대 ${POST_EDITOR_MAX_IMAGE_COUNT}장까지 첨부할 수 있어요.`,
                type: "error",
                duration: 3000,
              });
            }

            if (accepted.length === 0) {
              e.currentTarget.value = "";
              return;
            }

            const newFiles = accepted.map((file) => ({
              id: -1 as const,
              blob: file,
            }));
            setValue("imageFiles", [...(imageFiles ?? []), ...newFiles], {
              shouldDirty: true,
              shouldValidate: true,
            });
            e.currentTarget.value = "";
          }}
        />
        <label htmlFor="images">
          <div
            className={cn(
              "rounded-full border-[#DDDDDD] border-[1px] px-[8px] py-[4px] flex flex-row gap-2 items-center justify-center",
              interactionsDisabled
                ? "opacity-45 pointer-events-none"
                : "cursor-pointer"
            )}
          >
            <div>
              <CameraIcon className="size-6 text-grey-400" />
            </div>
            <div>사진 첨부</div>
          </div>
        </label>
      </div>

      <label
        className={cn(
          "flex flex-row gap-[4px] items-center",
          interactionsDisabled
            ? "opacity-45 pointer-events-none"
            : "cursor-pointer"
        )}
      >
        <input
          type="checkbox"
          disabled={Boolean(interactionsDisabled)}
          checked={Boolean(anonymity)}
          onChange={(e) =>
            setValue("anonymity", e.target.checked, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          name="anonymity"
          id="anonymity"
          className="hidden peer"
        />
        <div
          className="hidden size-[24px] peer-checked:flex rounded-sm items-center justify-center bg-primary"
        >
          <CheckIcon className="size-4 text-white stroke-[4]" />
        </div>
        <div className="size-[24px] bg-background border border-grey-400 peer-checked:hidden rounded-sm" />
        <div className="text-grey-400 peer-checked:text-grey-800 text-[14px]">
          익명 작성
        </div>
      </label>
    </div>
  );
}
