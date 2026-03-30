import React from "react";

import { ClubBoardBoundary } from "./_ClubBoardBoundary";
import { ClubBoardPage } from "./_ClubBoardPage";

export const dynamic = "force-dynamic";

export default function ClubBoardRoutePage() {
  return (
    <section className="relative flex w-full flex-col bg-background">
      <ClubBoardBoundary>
        <ClubBoardPage />
      </ClubBoardBoundary>
    </section>
  );
}