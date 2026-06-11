import { queryOptions } from "@tanstack/react-query";

import { clubListApi } from "../api";

export const clubListQueryKeys = {
  all: ["clubList"] as const,
  list: () => [...clubListQueryKeys.all, "list"] as const,
};

export const clubQueries = {
  all: () => ({
    queryKey: clubListQueryKeys.all,
  }),
  list: () =>
    queryOptions({
      queryKey: clubListQueryKeys.list(),
      queryFn: clubListApi,
      staleTime: 1000 * 60 * 60, // 1시간
      retry: 2,
    }),
};
