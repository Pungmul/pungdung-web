import { deleteComment } from "./delete-comment.api";

export const deleteReply = (commentId: number) => deleteComment(commentId);
