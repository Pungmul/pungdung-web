import type { PostSummary } from "@/features/post";

/** 핫포 배너에 필요한 게시글 필드만. */
export type HotPostBannerPost = Pick<PostSummary, "postId" | "title">;
