import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function PromotePage() {
  return redirect("/board/promote/l?tab=promotion-list");
}