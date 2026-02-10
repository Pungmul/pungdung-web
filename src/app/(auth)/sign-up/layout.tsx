import { Metadata } from "next";

export const metadata: Metadata = {
    title: "회원가입 | 풍덩",
    description: "풍덩의 회원가입 페이지 입니다.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
    return children;
}