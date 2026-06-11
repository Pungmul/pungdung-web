"use client";

interface NotificationBadgeProps {
  className?: string;
  notReadMessageCnt: number;
}

export default function NotificationBadge({ className = "", notReadMessageCnt }: NotificationBadgeProps) {
  const count = notReadMessageCnt;

  if (count === 0) return null;

  return (
    <span 
      className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full ${className}`}
      style={{
        width: 16,
        height: 16,
        fontSize: 10,
        fontWeight: "bold",
      }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
} 