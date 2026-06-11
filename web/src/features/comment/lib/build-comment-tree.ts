import type { Comment } from "../types";

export function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.commentId, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const currentComment = commentMap.get(comment.commentId);
    if (!currentComment) {
      return;
    }

    if (comment.parentId === null) {
      rootComments.push(currentComment);
      return;
    }

    const parentComment = commentMap.get(comment.parentId);
    if (parentComment) {
      parentComment.replies.push(currentComment);
    }
  });

  return rootComments;
}
