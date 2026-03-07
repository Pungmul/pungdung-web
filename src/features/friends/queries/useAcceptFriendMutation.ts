import { useMutation, useQueryClient } from "@tanstack/react-query";

import { acceptFriendRequest } from "../api/acceptFriendRequest";

export const useAcceptFriendMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};

