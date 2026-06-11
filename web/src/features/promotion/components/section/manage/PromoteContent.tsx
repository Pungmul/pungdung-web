import type { PostArticleDetail } from "@/features/post";
import { PostImage, PostLikeButton } from "@/features/post";

export function PromoteContent({
  post,
  fitMode = "full",
}: {
  post: PostArticleDetail;
  fitMode?: "fit" | "full";
}) {
  return (
    <div className={"flex flex-col w-full gap-4 px-6 py-5 bg-white " + (fitMode === "fit" ? "h-fit" : "h-full")}>
      {!!post && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <div className="font-semibold" style={{ fontSize: 17 }}>
              {post.title.trim() ? post.title : "제목 없음"}
            </div>
          </div>

          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-row gap-2 items-center">
              <div className="text-gray-400" style={{ fontSize: 14 }}>
                {post.author == "Anonymous" ? "익명" : post.author}
              </div>

              <div className="text-gray-300" style={{ fontSize: 11 }}>
                {post.timeSincePostedText === "0분 전"
                  ? "방금"
                  : post.timeSincePostedText}
              </div>
            </div>
            <div className="flex items-center flex-row gap-1">
              <div
                style={{ width: 20, height: 20 }}
                className="flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#9ca3af"
                  className="size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <div className="text-gray-400 text-[14px]">{post?.viewCount}</div>
            </div>
          </div>
        </div>
      )}

      {post && (
        <div style={{ fontSize: 14 }} className="break-words w-full">
          {post.content}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <div className="flex flex-row w-full gap-2">
          {post?.imageList?.map((image) => (
            <PostImage key={image.id} imageData={image} />
          ))}
        </div>
      </div>

      {post && (
        <div className="flex flex-row gap-4">
          <PostLikeButton
            isLiked={post.isLiked}
            postId={post.postId}
            likedNum={post.likedNum}
          />
          <div className="flex items-center flex-row gap-1">
            <div className="w-6 h-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#bfdbfe"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            </div>
            <div className="text-blue-300">
              {post?.commentList?.length ?? 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}