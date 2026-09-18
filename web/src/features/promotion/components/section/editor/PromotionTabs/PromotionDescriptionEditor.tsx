"use client";

import { useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { useFormContext, useWatch } from "react-hook-form";

import type { Editor as EditorType } from "@toast-ui/react-editor";

import { uploadPromotionImageToS3 } from "../../../../api/client";
import { PROMOTION_DESCRIPTION_EXAMPLE } from "../../../../constants/promotion-description";
import type { PromotionPostingFormValues } from "../../../../types/promotion-posting-form.types";

const Editor = dynamic(
  () =>
    import("@/features/promotion/components/section/toast-ui").then((mod) => ({
      default: mod.ToastUIEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-grey-100 rounded animate-pulse flex items-center justify-center text-grey-500">
        에디터 로딩 중...
      </div>
    ),
  }
);

export type PromotionDescriptionEditorProps = {
  editorRef: React.RefObject<EditorType | null>;
};

export function PromotionDescriptionEditor({
  editorRef,
}: PromotionDescriptionEditorProps) {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const { control, setValue } = useFormContext<PromotionPostingFormValues>();
  const descriptionSeed = useWatch({
    control,
    name: "descriptionSeed",
  });

  const uploadImage = async (blob: Blob, callback: (url: string) => void) => {
    if (!formId) {
      throw new Error("Form ID is missing");
    }

    const performanceImageList = await uploadPromotionImageToS3(
      Number(formId),
      blob
    );
    callback(performanceImageList[0]!.imageUrl);
  };

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const editor = editorRef.current.getInstance();
    const currentDescription = editor.getMarkdown();
    if (
      descriptionSeed !== undefined &&
      descriptionSeed !== null &&
      currentDescription !== descriptionSeed
    ) {
      editor.setMarkdown(descriptionSeed);
    }
  }, [descriptionSeed, editorRef]);

  const handleChange = useCallback(() => {
    if (!editorRef.current) {
      return;
    }

    const nextDescription = editorRef.current.getInstance().getMarkdown();
    if (nextDescription === descriptionSeed) return;
    // 빈 소개에 깔리는 예시 문구
    // 사용자 수정으로 보지 않음
    if (
      descriptionSeed === "" &&
      nextDescription === PROMOTION_DESCRIPTION_EXAMPLE
    ) {
      return;
    }
    setValue("descriptionSeed", nextDescription, {
      shouldDirty: true,
    });
  }, [descriptionSeed, editorRef, setValue]);

  return (
    <Editor
      ref={editorRef}
      class="text-grey-800"
      initialValue={descriptionSeed || PROMOTION_DESCRIPTION_EXAMPLE}
      width="100%"
      height="100%"
      placeholder="공연 소개를 입력해주세요."
      previewStyle="vertical"
      initialEditType="wysiwyg"
      useCommandShortcut={false}
      toolbarItems={[
        ["heading", "bold", "ul", "ol"],
        ["hr", "quote"],
        ["image", "link"],
      ]}
      hooks={{
        addImageBlobHook: uploadImage,
      }}
      onChange={handleChange}
    />
  );
}
