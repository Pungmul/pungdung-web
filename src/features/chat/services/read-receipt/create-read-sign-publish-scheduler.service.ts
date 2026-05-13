export type ReadSignPublishScheduler = {
  schedule: () => void;
};

/**
 * readSign publish를 직렬화한다.
 * 그룹 채팅처럼 연속 수신·post-entry가 겹칠 때 낮은 messageId publish가
 * 높은 id보다 늦게 서버에 도착하는 레이스를 막는다.
 */
export function createReadSignPublishScheduler(
  flush: () => Promise<void>
): ReadSignPublishScheduler {
  let publishing = false;
  let needsAnotherPublish = false;

  const run = async (): Promise<void> => {
    if (publishing) {
      needsAnotherPublish = true;
      return;
    }

    publishing = true;
    try {
      do {
        needsAnotherPublish = false;
        try {
          await flush();
        } catch {
          // publish 실패는 flush 쪽에서 pending 등으로 처리한다.
        }
      } while (needsAnotherPublish);
    } finally {
      publishing = false;
    }
  };

  return {
    schedule: () => {
      void run();
    },
  };
}
