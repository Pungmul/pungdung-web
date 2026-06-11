import type { PostSummary } from "./post-summary.types";

export interface PostSummaryWithCategory extends PostSummary {
  categoryName: string;
}
