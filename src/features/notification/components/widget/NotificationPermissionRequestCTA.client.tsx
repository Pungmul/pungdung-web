"use client";

import dynamic from "next/dynamic";

const NotificationPermissionRequestCTA = dynamic(
  () => import("./NotificationPermissionRequestCTA"),
  { ssr: false }
);

export default NotificationPermissionRequestCTA;
