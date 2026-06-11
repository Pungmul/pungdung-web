import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | 풍덩",
  description: "풍덩의 로그인 페이지 입니다.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}