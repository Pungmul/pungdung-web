import { cookies } from "next/headers";

import { KakaoSignUpPage } from "./kakao-sign-up-page";

import { invitationCodeSchema } from "@/features/auth/types/schemas";

// (auth) layout의 force-static은 cookies()를 빈 값으로 만듦
// 이 페이지만 요청 쿠키를 읽음
export const dynamic = "auto";

export default async function Page() {
  const cookieStore = await cookies();
  const parsed = invitationCodeSchema.safeParse(
    cookieStore.get("pendingInvitation")?.value
  );
  const initialInviteCode = parsed.success ? parsed.data : "";

  return <KakaoSignUpPage initialInviteCode={initialInviteCode} />;
}
