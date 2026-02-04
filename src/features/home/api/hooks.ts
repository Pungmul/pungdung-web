import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/core";
import { loadNearLightning } from "./lightning";
import { loadNotReadMessageCnt, loadNotReadMessage } from "./notification";

export function useNearLightningQuery() {
  return useSuspenseQuery({
    queryKey: ["nearLightning"],
    queryFn: loadNearLightning,
    retry: false,
    refetchOnMount: "always",
  });
}

export function useNotReadMessageCount() {
  return useQuery({
    queryKey: ["notificationCount"],
    queryFn: loadNotReadMessageCnt,
    refetchOnMount: "always",
  });
}

export function useNotReadMessageList() {
  return useSuspenseQuery({
    queryKey: ["notificationList"],
    queryFn: loadNotReadMessage,
    refetchOnMount: "always",
  });
}

export function prefetchNotReadMessageList() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["notificationList"],
    queryFn: loadNotReadMessage,
  });

  return queryClient;
}
