import { useQuery } from "@tanstack/react-query";

import { getMyPageInfo } from "../api";

import { myPageQueryKeys } from "../constant";

export const useGetMyPageInfo = () => {
  return useQuery({
    queryKey: myPageQueryKeys.info(),
    queryFn: getMyPageInfo,
  });
};

