import { PostContentSkeleton } from "@/features/post";

import { Header } from "@/shared";

export default function Loading() {
  return(
    <div className="relative w-full h-full flex-grow bg-grey-100">
        <div className="w-full h-full bg-grey-100 max-w-[768px] mx-auto">
          <Header title="" isBackBtn={false} />
          <PostContentSkeleton />
        </div>
  </div>
  )
}