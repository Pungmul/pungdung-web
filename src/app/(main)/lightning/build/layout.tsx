import { LightningBuildLayoutClient } from "./build-layout-client";

export default function LightningBuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LightningBuildLayoutClient>{children}</LightningBuildLayoutClient>;
}
