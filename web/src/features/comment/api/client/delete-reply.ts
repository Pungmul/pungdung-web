import { deleteComment } from "./delete-comment";

export const deleteReply = (commentId: number) => deleteComment(commentId);
