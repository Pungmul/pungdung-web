import { notFound } from "next/navigation";

import { Suspense } from "@suspensive/react";

import { ResponseDetail } from "@/features/promotion";

import { Header, Spinner } from "@/shared";

function ResponsePageFallback() {
  return (
    <>
      <Header title={""} isBackBtn={false} />
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        <Spinner size={32} />
      </div>
    </>
  );
}

export default async function ResponsePage({
  params,
}: {
  params: Promise<{ responseId: string }>;
}) {
  const { responseId } = await params;

  if (!responseId) {
    return notFound();
  }

  return (
    <main className="w-full flex flex-col bg-grey-100 flex-grow">
      <div className="w-full md:max-w-[768px] mx-auto h-full flex flex-col">
        <Suspense clientOnly fallback={<ResponsePageFallback />}>
          <ResponseDetail responseId={responseId} />
        </Suspense>
      </div>
    </main>
  );
}
