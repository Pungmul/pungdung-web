import ReactQueryProviders from "@/shared/lib/useReactQuery";

/** 인증 트리는 정적 프리렌더 우선(view는 루트 ViewStoreProvider에서 주입). */
export const dynamic = "force-static";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProviders>
      {children}
    </ReactQueryProviders>
  );
}
