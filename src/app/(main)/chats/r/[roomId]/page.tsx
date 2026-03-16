import { cookies } from "next/headers";

import ChatRoomBoundary from "./_ChatRoomBoundary";
import { ChatRoomPage } from "./_ChatRoomPage";

import { decodeAccessTokenUsername } from "@/features/auth/lib";

export default async function Page() {
  const decodedUsernamePromise = (async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    return decodeAccessTokenUsername(accessToken);
  })();

  return (
    <ChatRoomBoundary>
      <ChatRoomPage decodedUsernamePromise={decodedUsernamePromise} />
    </ChatRoomBoundary>
  );
}
