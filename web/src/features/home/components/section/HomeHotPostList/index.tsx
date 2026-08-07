"use client";

import { HomeHotPostList as HomeHotPostListImpl } from "./HomeHotPostList";
import { HomeHotPostListErrorBoundary } from "./HomeHotPostListErrorBoundary";

export function HomeHotPostList() {
  return (
    <HomeHotPostListErrorBoundary>
      <HomeHotPostListImpl />
    </HomeHotPostListErrorBoundary>
  );
}
