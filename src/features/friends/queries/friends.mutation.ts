import { mutationOptions } from "@tanstack/react-query";

import { friendsQueryInternal } from "./friends-query-internal";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  requestFriend,
} from "../api/client";

const root = friendsQueryInternal.all();

export const friendMutationOptions = {
  request: () =>
    mutationOptions({
      mutationKey: [...root, "request"],
      mutationFn: requestFriend,
    }),

  accept: () =>
    mutationOptions({
      mutationKey: [...root, "accept"],
      mutationFn: acceptFriendRequest,
    }),

  reject: () =>
    mutationOptions({
      mutationKey: [...root, "reject"],
      mutationFn: rejectFriendRequest,
    }),
};
