"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/shared";

export function ChatLoadFailFallback() {
  const router = useRouter();
  const handleBackToInbox = () => {
    router.replace("/chats/r/inbox");
  };
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1>채팅방에 접근할 수 없어요</h1>
      <Button onClick={handleBackToInbox}>목록으로 돌아가기</Button>
    </div>
  );
};
