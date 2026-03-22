"use client";
import { useParams } from "next/navigation";

import { Responsive } from "@/shared/components/Responsive";

export default function RoomPageContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { roomId } = useParams<{ roomId?: string }>();
  const shouldShowRoomOnMobile = Boolean(roomId);

  return (
    <Responsive
      key="responsive-room-page"
      mobile={
        shouldShowRoomOnMobile ? children : null
      }
      desktop={
        <div className="w-full min-w-[50dvw] h-app overflow-y-auto">
          {children}
        </div>
      }
    />
  );
}
