import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "풍덩 | 홈",
  description: "풍덩의 메인화면 입니다.",
};

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
