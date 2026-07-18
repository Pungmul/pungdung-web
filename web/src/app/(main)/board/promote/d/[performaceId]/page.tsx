import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { hasAuthSessionCookie } from "@/features/auth";

import PromotionDetailBoundary from "./_PromotionDetailBoundary";
import { PromotionDetailPage } from "./_PromotionDetailPage";


type PageProps = {
  params: Promise<{ performaceId: string }>;
};

export default async function PromotionDetailRoutePage({ params }: PageProps) {
  const { performaceId } = await params;
  const cookieStore = await cookies();
  if (!performaceId) {
    notFound();
  }

  return (
    <div className="bg-grey-100 w-full">
      <PromotionDetailBoundary>
        <PromotionDetailPage
          performaceId={performaceId}
          isGuest={
            !hasAuthSessionCookie(
              cookieStore.get("accessToken")?.value,
              cookieStore.get("refreshToken")?.value
            )
          }
        />
      </PromotionDetailBoundary>
    </div>
  );
}
