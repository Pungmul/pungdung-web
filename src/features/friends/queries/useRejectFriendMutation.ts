import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rejectFriendRequest } from "../api/rejectFriendRequest";

export const useRejectFriendMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (friendRequestId: number) => rejectFriendRequest(friendRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};


