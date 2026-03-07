import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/shared/lib";

import { friendStore } from "../store";

import { loadMyFriends } from "../api/loadMyFriends";

export const useLoadMyFriends = () => {
  const searchKeyword = friendStore((state) => state.friendsFilter.keyword);
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  return useQuery({
    queryKey: ["friends"],
    queryFn: () => loadMyFriends(debouncedKeyword),
  });
};
