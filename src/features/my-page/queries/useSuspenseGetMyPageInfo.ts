import { useSuspenseQuery } from "@tanstack/react-query";

import { getMyPageInfo } from "../api";

import { myPageQueryKeys } from "../constant";

export const useSuspenseGetMyPageInfo = () => {
  return useSuspenseQuery({
    queryKey: myPageQueryKeys.info(),
    queryFn: getMyPageInfo,
    staleTime: 1000 * 60 * 5,
  });
};

