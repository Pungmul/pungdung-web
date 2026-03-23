"use client";

import { memo, useMemo, useState } from "react";

import { CommentOutline, EyeIcon } from "@/shared/components/Icons";

import { PostImageList } from "./PostImageList";
import { PostLikeButton } from "./PostLikeButton";
import type { PostArticleDetail } from "../../types";
import { ImageOverlay } from "../overlay/ImageOverlay";

function PostContentImpl({
  post,
  fitMode = "full",
}: {
  post: PostArticleDetail;
  fitMode?: "fit" | "full";
}) {
  // 이미지 확대 오버레이: 열림 + 선택 슬라이드
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 오버레이 스와이퍼용(쿼리스트립 제거한 원본 URL)
  const overlayImages = useMemo(
    () =>
      (post?.imageList || []).map((image) => ({
        url: image.fullFilePath
          ? image.fullFilePath.split("?")[0]!
          : "/default-image.png",
        name: image.convertedFileName,
      })),
    [post?.imageList]
  );

  return (
    <div
      className={
        "flex flex-col w-full gap-4 md:py-6 py-5 bg-background min-h-[292px]" +
        (fitMode === "fit" ? "h-fit" : "h-full")
      }
    >
      {!!post && (
        <div className="flex flex-col gap-2">
          <div className="px-6">
            <div className="font-semibold text-lg md:text-xl">
              {post.title.trim() ? post.title : "제목 없음"}
            </div>
          </div>

          <div className="flex flex-row justify-between items-start px-6">
            <div className="flex flex-row gap-2 items-center">
              <div className="text-grey-400 text-sm">
                {post.author == "Anonymous" ? "익명" : post.author}
              </div>

              <div className="text-grey-300 text-sm">
                {post.timeSincePostedText === "0분 전"
                  ? "방금"
                  : post.timeSincePostedText}
              </div>
            </div>
            <div className="flex items-center flex-row">
              <div className="flex justify-center items-center size-6 p-1">
                <EyeIcon className="size-full text-grey-500" />
              </div>
              <div className="text-grey-400 leading-6 text-[13px]">{post?.viewCount}</div>
            </div>
          </div>
        </div>
      )}

      {post && (
        <div className="text-[14px] md:text-[15px] break-words w-full space-y-6 whitespace-pre-wrap px-6">
          {post.content}
        </div>
      )}

      {post?.imageList && post.imageList.length > 0 && (
        <PostImageList
          imageList={post.imageList}
          onImageClick={(index) => {
            setSelectedImageIndex(index);
            setIsOverlayOpen(true);
          }}
        />
      )}

      <ImageOverlay
        isOpen={isOverlayOpen}
        images={overlayImages}
        initialIndex={selectedImageIndex}
        onClose={() => setIsOverlayOpen(false)}
      />

      {post && (
        <div className="flex items-center flex-row gap-2 px-6">
          <PostLikeButton
            isLiked={post.isLiked}
            postId={post.postId}
            likedNum={post.likedNum}
          />
          <div className="flex items-center flex-row cursor-pointer">
            <div className="flex size-7 p-1 items-center justify-center">
              <CommentOutline className="size-full text-grey-400" />
            </div>
            <div className="text-grey-400 leading-6">
              {post?.commentList?.length ?? 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const PostContent = memo(PostContentImpl);
