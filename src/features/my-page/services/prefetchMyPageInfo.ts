import { getQueryClient } from "@/core";

import { getMyPageInfo } from "../api";

import { myPageQueryKeys } from "../constant";

export const prefetchMyPageInfo = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: myPageQueryKeys.info(),
    queryFn: getMyPageInfo,
    staleTime: 1000 * 60 * 5,
  });

  return queryClient;
};

