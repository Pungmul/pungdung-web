import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/shared/lib";

import { friendStore } from "../store";

import { findFriends } from "../api/findFriends";

export const useFindFriends = () => {
  const searchKeyword = friendStore((state) => state.friendsFilter.keyword);
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  return useQuery({
    queryKey: ["findFriends", debouncedKeyword],
    queryFn: () => findFriends(debouncedKeyword),
  });
};
