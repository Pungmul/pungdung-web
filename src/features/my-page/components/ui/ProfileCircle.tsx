import Image from "next/image";

import type { Member } from "@/features/user";

import { cn } from "@/shared/lib";

interface ProfileCircleProps {
  myInfo: Member;
  className?: string;
}

export function ProfileCircle({ myInfo, className }: ProfileCircleProps) {
  return (
    <div
      className={cn(
        "relative size-9 shrink-0 overflow-hidden rounded-full border-2 border-black",
        className
      )}
    >
      {myInfo?.profile.fullFilePath ? (
        <Image
          src={myInfo?.profile.fullFilePath || ""}
          fill={true}
          className="rounded-full object-cover object-center overflow-hidden"
          alt="profile"
        />
      ) : (
        <Image
          src={"/icons/MyPage-Icon.svg"}
          fill={true}
          className="rounded-full object-cover object-center overflow-hidden"
          alt="profile-default"
        />
      )}
    </div>
  );
}
