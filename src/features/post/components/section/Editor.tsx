"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { throttle } from "lodash";
import { Editor as DraftJsEditor, EditorState } from "draft-js";

import { Header, Spinner } from "@/shared/components";

import { useCreatePostEditorAction } from "../../hooks/actions";
import { useResetPostEditorFormFromDetail } from "../../hooks/form";
import { usePostFormDetailViewModel } from "../../hooks/view-model";
import {
  buildCreatePostFormData,
  compressPostEditorImages,
  normalizePostImagesForMultipart,
} from "../../services";
import { postEditorStateFromPlainText } from "../../services/post-editor-state-from-plain-text";
import {
  emptyPostEditorFormValues,
  type PostEditorFormValues,
  postEditorFormValuesSchema,
} from "../../types/schemas";
import { ImageListPreview } from "../ui/ImageListPreview";
import { PostFooter } from "../ui/PostFooter";
import { PostingRuleText } from "../ui/PostingRuleText";
import { PostSubmitProgressOverlay } from "../ui/PostSubmitProgressOverlay";

import "draft-js/dist/Draft.css";

export function Editor({ boardID }: { boardID: number }) {
  // 헤더 뒤로가기
  const router = useRouter();
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  // 상세 쿼리 기반 초기값(신규 작성은 postId 없음 → 빈 문자열)
  const {
    initContent,
    postTitle: detailTitle,
    postContent: detailContent,
    postImageList: detailImageList,
    postAuthor: detailAuthor,
  } = usePostFormDetailViewModel(null);

  // RHF 폼 인스턴스 + 상세 쿼리가 바뀔 때 폼 필드 동기화
  const methods = useForm<PostEditorFormValues>({
    resolver: zodResolver(postEditorFormValuesSchema),
    defaultValues: emptyPostEditorFormValues,
  });

  useResetPostEditorFormFromDetail(methods, {
    postTitle: detailTitle,
    postContent: detailContent,
    postImageList: detailImageList,
    postAuthor: detailAuthor,
  });

  // 제출 성공 후 폼·Draft 본문 초기화
  const resetAfterSubmit = useCallback(() => {
    methods.reset(emptyPostEditorFormValues);
    setEditorState(() => postEditorStateFromPlainText("", "newPost"));
  }, [methods]);

  // 등록 mutation
  const { submitPost, isSubmittingPost, submitUploadUi, setSubmitUploadUi } =
    useCreatePostEditorAction({
      reset: resetAfterSubmit,
    });

  // Draft 본문 + 스크롤 영역 패딩
  const [editorState, setEditorState] = useState(() =>
    postEditorStateFromPlainText(initContent, "newPost")
  );

  const [hasScroll, setHasScroll] = useState(false);

  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<DraftJsEditor | null>(null);

  const checkForScroll = useCallback(() => {
    if (scrollableRef.current) {
      setHasScroll(
        scrollableRef.current.scrollHeight > scrollableRef.current.clientHeight
      );
    }
  }, []);

  const checkForScrollThrottled = useMemo(
    () => throttle(() => checkForScroll(), 5000),
    [checkForScroll]
  );

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
    methods.setValue("content", newState.getCurrentContent().getPlainText(), {
      shouldDirty: true,
      shouldValidate: true,
    });
    checkForScrollThrottled();
  };

  // 저장 버튼: 제목·본문 입력 여부
  const [titleWatch, contentWatch, imageFilesWatch] = useWatch({
    control: methods.control,
    name: ["title", "content", "imageFiles"],
  });

  const hasImageUploadSubmission = Boolean(imageFilesWatch?.length);

  const canSubmit =
    (titleWatch?.trim().length ?? 0) > 0 &&
    (editorState.getCurrentContent().getPlainText().length > 0 ||
      Boolean(contentWatch?.trim().length));

  const handlePosting = methods.handleSubmit(async (values) => {
    if (isSubmittingPost) {
      return;
    }

    let imageFiles = normalizePostImagesForMultipart(values.imageFiles);
    const newImageCount = imageFiles.filter((f) => f.id === -1).length;

    if (newImageCount > 0) {
      setSubmitUploadUi({
        phase: "compressing",
        current: 0,
        total: newImageCount,
        percent: 0,
      });
      imageFiles = await compressPostEditorImages(imageFiles, {
        onProgress: ({ current, total }) => {
          setSubmitUploadUi({
            phase: "compressing",
            current,
            total,
            percent:
              total > 0 ? Math.min(99, Math.floor((100 * current) / total)) : 0,
          });
        },
      });
    }

    const userForm = buildCreatePostFormData({
      title: values.title,
      content: values.content,
      anonymity: values.anonymity,
      imageFiles,
    });

    await submitPost({
      boardId: boardID,
      formData: userForm,
      hasImageUpload: hasImageUploadSubmission,
    });
  });

  return (
    <FormProvider {...methods}>
      <form className="relative h-full flex flex-col" onSubmit={handlePosting}>
        <PostSubmitProgressOverlay uploadUi={submitUploadUi} />
        <Header
          title={"글쓰기"}
          onLeftClick={goBack}
          rightBtn={
            isSubmittingPost ? (
              <div
                aria-hidden
                className="flex w-8 items-center justify-center"
              >
                <Spinner size={22} baseColor="#E8E8E8" highlightColor="#6B7280" />
              </div>
            ) : canSubmit ? (
              <button
                type="submit"
                className="text-center text-primary cursor-pointer w-8 "
              >
                저장
              </button>
            ) : (
              <div className="text-center text-grey-300 w-8 ">저장</div>
            )
          }
        />
        <div className="my-4 min-h-60 w-full flex px-4 flex-col flex-grow gap-[12px]">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="px-2 outline-none border-t-0 border-l-0 border-r-0 border-b border-grey-300 placeholder-grey-300 font-medium text-xl pb-0.5 mb-2 break-words w-full"
            {...methods.register("title")}
          />
          <div
            ref={scrollableRef}
            onClick={() => {
              editorRef.current?.focus();
            }}
            className={`flex-grow overflow-y-auto flex flex-col ${
              hasScroll ? "pl-4 pr-1" : "px-2"
            }`}
          >
            <div className="flex flex-col">
              <div className="min-h-32">
                <DraftJsEditor
                  ref={editorRef}
                  editorState={editorState}
                  placeholder="내용을 작성하세요"
                  onChange={handleEditorChange}
                />
              </div>
              <ImageListPreview interactionsDisabled={isSubmittingPost} />
              <span className="text-grey-500 text-right font-light">
                {editorState.getCurrentContent().getPlainText().length}
              </span>
              <PostingRuleText editorState={editorState} />
            </div>
          </div>
          <PostFooter interactionsDisabled={isSubmittingPost} />
        </div>
      </form>
    </FormProvider>
  );
}
