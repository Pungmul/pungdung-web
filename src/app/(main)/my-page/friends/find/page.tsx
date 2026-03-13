import type { Metadata } from "next";

import { FindFriendPage } from "./_FindFriendPage";

export const metadata: Metadata = {
    title: "친구 검색 | 풍덩",
    description: "친구를 검색하고 요청합니다.",
};

export default function Page() {
    return <FindFriendPage />;
}
