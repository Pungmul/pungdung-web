"use client";

import { useCallback, useEffect, useState } from "react";

import { HandThumbUpIcon as HandThumbUpIconOutline } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpIconSolid } from "@heroicons/react/24/solid";

import { useLoginRequiredConfirmAction } from "@/features/auth";

import { usePostLikeWithConfirmAction } from "../../hooks/actions";

export function PostLikeButton({
  postId,
  isLiked,
  likedNum: initialLikedNum,
  isGuest = false,
}: {
  postId: number;
  isLiked: boolean;
  likedNum: number;
  isGuest?: boolean;
}) {
  // 서버 스냅샷과 로컬 낙관적 표시 동기화
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likedNum, setLikedNum] = useState(initialLikedNum);

  // 확인 다이얼로그 후 추천 API
  const { requestToggle } = usePostLikeWithConfirmAction();
  const { requestLogin } = useLoginRequiredConfirmAction();

  useEffect(() => {
    setIsLikedState(isLiked);
    setLikedNum(initialLikedNum);
  }, [postId, isLiked, initialLikedNum]);

  const handleLikeClick = useCallback(() => {
    if (isGuest) {
      requestLogin();
      return;
    }

    requestToggle({
      postId,
      isLikedBeforeToggle: isLikedState,
      onApplied: (data) => {
        setLikedNum(data.likedNum);
        setIsLikedState(data.liked);
      },
    });
  }, [isGuest, postId, isLikedState, requestLogin, requestToggle]);

  return (
    <div
      className="flex items-center flex-row cursor-pointer"
      onClick={handleLikeClick}
    >
      <div className="flex size-7 p-1 items-center justify-center">
        {isLikedState ? (
          <HandThumbUpIconSolid className="size-full text-[#FF7B7B]" />
        ) : (
          <HandThumbUpIconOutline className="size-full text-[#FF7B7B]" />
        )}
      </div>
      <div className="text-red-300 leading-6 text-[13px]">{likedNum}</div>
    </div>
  );
}
