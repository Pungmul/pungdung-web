import { notFound } from "next/navigation";

import PromotionDetailBoundary from "./_PromotionDetailBoundary";
import { PromotionDetailPage } from "./_PromotionDetailPage";


type PageProps = {
  params: Promise<{ performaceId: string }>;
};

export default async function PromotionDetailRoutePage({ params }: PageProps) {
  const { performaceId } = await params;
  if (!performaceId) {
    notFound();
  }

  return (
    <div className="bg-grey-100 w-full">
      <PromotionDetailBoundary>
        <PromotionDetailPage performaceId={performaceId} />
      </PromotionDetailBoundary>
    </div>
  );
}
