import { notFound } from "next/navigation";

import { Suspense } from "@suspensive/react";

import { Spinner } from "@/shared";

import { Editor, ModifyEditor } from "./_Editor";


export default async function Posting({
  searchParams,
}: {
  searchParams: Promise<{ boardId: string; documentId?: string }>;
}) {
  const { boardId, documentId } = await searchParams;

  if (!boardId && !documentId) {
    return notFound();
  }

  return (
    <div className="w-full bg-grey-100">
      <div className="w-full md:max-w-[768px] min-h-app md:mx-auto h-full bg-background">
        <Suspense
          clientOnly
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-background">
              <Spinner size={32} />
            </div>
          }
        >
          {documentId ? (
            <ModifyEditor documentId={Number(documentId)} />
          ) : (
            <Editor boardID={Number(boardId)} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
