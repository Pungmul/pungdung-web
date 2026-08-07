import { notFound } from "next/navigation";

import { ResponseDetail } from "@/features/promotion";

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
        <ResponseDetail responseId={responseId} />
      </div>
    </main>
  );
}
