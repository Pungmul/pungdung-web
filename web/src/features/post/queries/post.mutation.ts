import { mutationOptions } from "@tanstack/react-query";

import { postQueries } from "./post.query";
import {
  createPost,
  deletePost,
  likePost,
  reportPost,
  updatePost,
} from "../api/client";

const postMutationRoot = [...postQueries.all(), "mutation"] as const;

export const postMutationOptions = {
  create: () =>
    mutationOptions({
      mutationFn: createPost,
    }),
  update: () =>
    mutationOptions({
      mutationFn: updatePost,
    }),
  delete: () =>
    mutationOptions({
      mutationFn: deletePost,
    }),
  like: () =>
    mutationOptions({
      mutationKey: [...postMutationRoot, "like"] as const,
      mutationFn: likePost,
    }),
  report: () =>
    mutationOptions({
      mutationKey: [...postMutationRoot, "report"] as const,
      mutationFn: reportPost,
    }),
};
