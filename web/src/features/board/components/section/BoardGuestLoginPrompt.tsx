import { Button, cn } from "@/shared";
import { KakaoLogo } from "@/shared/components/Icons";

interface BoardGuestLoginPromptProps {
  message: string;
  showLoginButton?: boolean;

  messageClassNames?: string;
}

export function BoardGuestLoginPrompt({
  message,
  messageClassNames,
  showLoginButton = false,
}: BoardGuestLoginPromptProps) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 px-4 text-center">
      <p className={cn("text-[15px] font-semibold text-grey-600", messageClassNames)}>{message}</p>
      {showLoginButton && (
        <Button
          className={cn("h-10 max-w-[220px] gap-2 !bg-kakao px-4 text-sm text-black")}
          onClick={() => {
            window.location.href = "/api/auth/kakao/login?redirectURL=%2Fboard%2Fmain";
          }}
        >
          <KakaoLogo className="size-5" />
          카카오 로그인
        </Button>
      )}
    </div>
  );
}
