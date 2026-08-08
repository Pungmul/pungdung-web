type OnlineRecoveryListener = () => void;

const listeners = new Set<OnlineRecoveryListener>();

export function subscribeOnlineRecovery(listener: OnlineRecoveryListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyOnlineRecovery() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // 한 구독자 실패가 나머지 복구를 막지 않음
    }
  });
}
