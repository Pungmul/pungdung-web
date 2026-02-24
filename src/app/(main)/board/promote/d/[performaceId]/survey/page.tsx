import { notFound } from "next/navigation";

import { Suspense } from "@suspensive/react";

import { Header, Spinner } from "@/shared";

import { PromotionSurveyRoutePage } from "./_PromotionSurveyPage";

type PageProps = {
  params: Promise<{ performaceId: string }>;
};

function PromotionSurveyFallback() {
  return (
    <div className="w-full flex flex-col gap-[12px] md:max-w-[768px] mx-auto min-h-screen bg-background">
      <Header title={""} isBackBtn={false} />
      <div className="w-full flex flex-col items-center justify-center">
        <Spinner size={32} />
      </div>
    </div>
  );
}

export default async function PromotionSurveyRoute({ params }: PageProps) {
  const { performaceId } = await params;
  if (!performaceId) {
    notFound();
  }

  return (
    <div className="w-full flex flex-col bg-grey-100">
      <Suspense clientOnly fallback={<PromotionSurveyFallback />}>
        <PromotionSurveyRoutePage performaceId={performaceId} />
      </Suspense>
    </div>
  );
}
