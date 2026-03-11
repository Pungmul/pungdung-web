import ChatRoomBoundary from "./_ChatRoomBoundary";
import { ChatRoomPage } from "./_ChatRoomPage";

export default function Page() {
  return (
    <ChatRoomBoundary>
      <ChatRoomPage />
    </ChatRoomBoundary>
  );
}
