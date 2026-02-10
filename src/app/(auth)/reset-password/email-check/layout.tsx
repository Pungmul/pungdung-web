import { Metadata } from "next";

export const metadata: Metadata = {
    title: "비밀번호 재설정 | 풍덩",
    description: "풍덩의 비밀번호 재설정 페이지 입니다.",
};

export default function EmailCheckLayout({ children }: { children: React.ReactNode }) {
    return children;
}