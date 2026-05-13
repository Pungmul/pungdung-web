import { lazy } from "react";

import { Suspense } from "@suspensive/react";

const RoomPageContent = lazy(() => import("./RoomContent"));

export default function RoomPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense clientOnly fallback={<div className="min-w-[50dvw] flex-grow"></div>}>
      <RoomPageContent>{children}</RoomPageContent>
    </Suspense>
  );
}
