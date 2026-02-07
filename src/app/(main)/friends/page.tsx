import { fetchWithRefresh } from "@/core/api/server";

import { FriendsClientComponent } from "@/features/friends";

// 서버 사이드 렌더링 완전 비활성화
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const loadFriendList = async () => {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/friends`;

    const response = await fetchWithRefresh(proxyUrl);

    if (!response.ok) throw Error("서버 불안정" + response.status);

    // 프록시 응답 받기
    const proxyResponse = await response.json();
    const { response: friendList, requestedFriendList } = proxyResponse;
    console.log(friendList);
    // 클라이언트에 프록시 응답 반환
    return { friendList, requestedFriendList };
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    throw error;
  }
};

export default async function Page() {
  const { friendList, requestedFriendList } = await loadFriendList();

  return (
    <FriendsClientComponent
      initFriendList={friendList}
      initRquestedFriendsList={requestedFriendList}
    />
  );
}
