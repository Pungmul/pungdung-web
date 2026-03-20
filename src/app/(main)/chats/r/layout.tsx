import { Metadata } from "next";

import { ChatLayoutClient } from "./_ChatLayoutClient";

export const metadata: Metadata = {
  title: "풍덩 | 채팅",
  description: "풍덩 채팅 페이지",
};

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatLayoutClient>{children}</ChatLayoutClient>;
}
