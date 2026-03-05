import { Metadata } from "next";

export const metadata: Metadata = {
    title: "카카오로 시작하기 | 풍덩",
    description: "풍덩의 회원가입 페이지 입니다.",
};

export default function KakaoSignUpLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background h-full w-full">
            <div className="flex flex-col h-full w-full min-w-[360px] max-w-[768px] mx-auto relative bg-background">
                {children}
            </div>
        </div>
    );
}