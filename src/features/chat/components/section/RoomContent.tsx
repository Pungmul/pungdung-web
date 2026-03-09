"use client";
import { useParams } from "next/navigation";

import { Responsive } from "@/shared/components/Responsive";

export default function RoomPageContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { roomId } = useParams();

  return (
    <Responsive
      key="responsive-room-page"
      mobile={
        roomId ? (
          <div className="absolute top-0 left-0 w-full h-app z-50">
            {children}
          </div>
        ) : null
      }
      desktop={
        <div className="w-full min-w-[50dvw] h-app overflow-y-auto">
          {children}
        </div>
      }
    />
  );
}
