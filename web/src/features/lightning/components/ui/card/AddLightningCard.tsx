"use client";
import Link from "next/link";

import { PlusIcon } from "@heroicons/react/24/outline";

export function AddLightningCard() {
  return (
    <Link
      href="/lightning/build"
      className="w-full h-full rounded-lg items-center justify-center flex flex-col gap-1 bg-background border-[4px] border-grey-400 border-dashed cursor-pointer"
    >
      <div className="text-grey-400">번개 생성</div>
      <span className="size-7 flex items-center justify-center">
        <PlusIcon className="size-full text-grey-400" />
      </span>
    </Link>
  );
}
