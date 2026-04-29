import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

import type { SocketManager } from "../../client/socket-manager";

type EqualityFn<T> = (a: T, b: T) => boolean;

type UseSocketStoreSelectorOptions<TSnapshot, TSelection> = {
  socket: SocketManager | undefined;
  getSnapshot: (socket: SocketManager) => TSnapshot;
  getServerSnapshot: () => TSnapshot;
  selector: (snapshot: TSnapshot) => TSelection;
  isEqual?: EqualityFn<TSelection>;
};

const EMPTY_UNSUBSCRIBE = () => {};

export function useSocketStoreSelector<TSnapshot, TSelection>(
  options: UseSocketStoreSelectorOptions<TSnapshot, TSelection>
): TSelection {
  const { socket, getSnapshot, getServerSnapshot, selector, isEqual } = options;

  return useSyncExternalStoreWithSelector(
    (callback) =>
      socket ? socket.storeSubscribe(callback) : EMPTY_UNSUBSCRIBE,
    () => (socket ? getSnapshot(socket) : getServerSnapshot()),
    getServerSnapshot,
    selector,
    isEqual
  );
}
