"use client";

import React from "react";
import Image from "next/image";

import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/shared/lib";

import type { PostEditorFormValues } from "../../types/schemas";

export function ImageListPreview({
  interactionsDisabled,
}: {
  interactionsDisabled?: boolean;
}) {
  const { control, setValue } = useFormContext<PostEditorFormValues>();
  const imageFiles = useWatch({ control, name: "imageFiles" }) ?? [];

  if (!imageFiles.length) return null;
  return (
    <div className="flex flex-row gap-2 overflow-x-auto items-center py-2 mt-20 md:flex-wrap">
      {imageFiles.map((file, index) => {
        const imageUrl =
          file.id === -1
            ? URL.createObjectURL(file.blob)
            : file.url!;
        const fileKey =
          typeof file.id === "number"
            ? `img-${file.id}-${index}`
            : `blob-${index}`;

        return (
          <div
            key={"첨부 이미지" + fileKey}
            className="relative overflow-visible size-24 md:size-32 rounded-md shrink-0"
          >
            <Image
              src={imageUrl}
              alt="이미지"
              fill
              style={{ objectFit: "cover" }}
            ></Image>
            <div
              className={cn(
                "absolute cursor-pointer -top-2 -right-2 w-6 h-6 bg-black rounded-full text-white items-center justify-center flex",
                interactionsDisabled && "opacity-40 pointer-events-none"
              )}
              role="presentation"
              onClick={() => {
                if (interactionsDisabled) return;
                const next = imageFiles.filter((_, i) => i !== index);
                setValue("imageFiles", next, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              x
            </div>
          </div>
        );
      })}
    </div>
  );
}
