import { useMutation, useQueryClient } from "@tanstack/react-query";

import { requestFriend } from "../api/requestFriend";

export const useRequestFriendMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: string) => requestFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["findFriends"] });
    },
  });
};
