import { Metadata } from "next";

export const metadata: Metadata = {
    title: "로그아웃 | 풍덩",
    description: "풍덩의 로그아웃 페이지 입니다.",
};

export default function LogoutLayout({ children }: { children: React.ReactNode }) {
    return children;
}