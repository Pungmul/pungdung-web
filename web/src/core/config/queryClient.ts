import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 클라이언트에서 즉시 refetch하지 않도록 설정
        staleTime: 1000 * 60 * 5, // 5분 - 데이터를 더 오래 신선하게 유지
        gcTime: 1000 * 60 * 10, // 10분 - 캐시를 더 오래 유지하여 뒤로가기 시 데이터 보존
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false, // 컴포넌트 마운트 시 자동 리페칭 비활성화
        retry: (failureCount, error: unknown) => {
          // 4xx 에러는 재시도하지 않음
          if (error instanceof Error && error.message.includes("400")) {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버: 항상 새로운 query client 생성
    return makeQueryClient();
  } else {
    // 브라우저: 싱글톤 query client 생성
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
} 