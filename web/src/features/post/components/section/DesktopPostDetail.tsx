"use client";

import { useQuery } from "@tanstack/react-query";

import { CommentsList } from "@/features/comment";

import { LinkChipButton, ListEmptyView } from "@/shared/components";

import { PostContent } from "./PostContent";
import { PostMenu } from "./PostMenu";
import { isPostDeletedError } from "../../api/client";
import { postQueries } from "../../queries";
import { ReportPostModal } from "../overlay/ReportPostModal";
import { PostContentSkeleton } from "../ui/PostContentSkeleton";

export function DesktopPostDetail({ postId }: { postId: number }) {
  // 본문·스켈레톤·우측 메뉴 작성자 여부·댓글에 공통으로 사용
  const { data: post, isLoading, error } = useQuery(postQueries.detail(postId));
  const isDeletedPostError = isPostDeletedError(error);

  return (
    <div className="relative w-full h-full overflow-visible flex flex-row">
      <div className="flex flex-row h-full rounded-xl overflow-hidden flex-grow relative">
        <div className="relative flex-grow flex-shrink min-w-0">
          {post && !isDeletedPostError ? (
            <div className="absolute top-[8px] right-[8px] p-[2px] rounded-md flex justify-center items-center gap-[8px] bg-[#FFF]">
              <div className=" w-[36px] h-[36px] cursor-pointer flex justify-center items-center">
                <PostMenu isWriter={post.isWriter} />
              </div>
            </div>
          ) : null}
          <div className="w-full h-full overflow-auto">
            {isLoading ? (
              <PostContentSkeleton />
            ) : isDeletedPostError ? (
              <ListEmptyView
                message="삭제되었거나 볼 수 없는 게시글입니다."
                action={
                  <LinkChipButton href="/board/main" filled>
                    게시판으로
                  </LinkChipButton>
                }
                className="min-h-full bg-background"
              />
            ) : (
              post && <PostContent post={post} />
            )}
          </div>
        </div>
        <div className="relative w-[40%] flex-shrink-0 h-full bg-[#F9F9F9]">
          <div className="h-full overflow-y-auto">
            {post && !isDeletedPostError && post.commentList && (
              <CommentsList comments={post.commentList} postId={post.postId} />
            )}
          </div>
        </div>
      </div>
      <ReportPostModal />
    </div>
  );
}
