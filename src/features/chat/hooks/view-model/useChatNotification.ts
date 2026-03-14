import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { chatQueries } from "../../queries";

/**
 * 채팅 알림용 간단한 훅
 * bottomTab이나 다른 컴포넌트에서 읽지 않은 메시지 수만 필요할 때 사용
 */
export const useChatNotification = () => {
  // zustand 스토어에서 필요한 값들만 선택적으로 가져오기
  const { data: queryData = [] } = useQuery(chatQueries.roomList());
  const totalUnreadCount = useMemo(() => {
    if (queryData.length === 0 || !(queryData instanceof Array)) return 0;
    return queryData.reduce((acc, room) => acc + (room.unreadCount ?? 0), 0);
  }, [queryData]);
  return {
    /**
     * 전체 읽지 않은 메시지 수
     */
    totalUnreadCount,

    /**
     * 읽지 않은 메시지가 있는지 여부
     */
    hasUnreadMessages: totalUnreadCount > 0,

    /**
     * 표시할 배지 텍스트 (99+ 처리 포함)
     */
    badgeText: totalUnreadCount > 99 ? "99+" : totalUnreadCount.toString(),

    /**
     * 배지를 표시해야 하는지 여부
     */
    shouldShowBadge: totalUnreadCount > 0,
  };
};
