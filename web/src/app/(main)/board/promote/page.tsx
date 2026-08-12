import { redirect } from "next/navigation";

import { getBoardRoute, PROMOTE_BOARD_SEGMENT } from "@/features/board";

export const dynamic = "force-static";

export default function PromotePage() {
  return redirect(getBoardRoute(PROMOTE_BOARD_SEGMENT));
}
