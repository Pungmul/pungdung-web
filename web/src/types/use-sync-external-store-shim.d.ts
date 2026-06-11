declare module "use-sync-external-store/shim/with-selector" {
  export function useSyncExternalStoreWithSelector<TSnapshot, TSelection>(
    subscribe: (callback: () => void) => () => void,
    getSnapshot: () => TSnapshot,
    getServerSnapshot: (() => TSnapshot) | undefined,
    selector: (snapshot: TSnapshot) => TSelection,
    isEqual?: (a: TSelection, b: TSelection) => boolean
  ): TSelection;
}
