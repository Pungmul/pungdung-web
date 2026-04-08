"use client";
import { useChatNotification } from "../../hooks/view-model";

interface ChatTabBadgeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * BottomTab의 채팅 아이콘에 읽지 않은 메시지 배지를 표시하는 컴포넌트
 */
export const ChatTabBadge = ({
  children,
  className = "",
}: ChatTabBadgeProps) => {
  const { shouldShowBadge, badgeText, totalUnreadCount } = useChatNotification();

  return (
    <div className={`relative ${className}`}>
      {children}

      {shouldShowBadge && (
        <div className="absolute max-md:-top-1 max-md:-right-1 -top-2 -right-2 max-md:size-4 size-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white max-md:text-[10px] text-xs font-medium px-1">
            {badgeText}
          </span>
        </div>
      )}

      {/* 접근성을 위한 숨겨진 텍스트 */}
      {shouldShowBadge && (
        <span className="sr-only">{totalUnreadCount}개의 읽지 않은 메시지</span>
      )}
    </div>
  );
};

export default ChatTabBadge;
