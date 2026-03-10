import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "친구 검색 | 풍덩",
  description: "친구를 검색하고 요청합니다.",
};

/** 본문은 인터셉트에서만 노출; 이 세그먼트의 page는 하드 네비 시 목록으로 redirect */
export default function FindFriendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
