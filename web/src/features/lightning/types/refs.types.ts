export interface LightningCardRefType {
  focus: () => void;
  blur: () => void;
}

export interface LightningBottomSheetRefType {
  getLevel: () => number;
  /** 현재 시트 위치에서 가장 가까운 level로 맞춘 뒤 visible height를 반환한다. */
  reconcileLevelFromPosition: () => number;
  onLevelChange: (
    callback: (oldLevel: number, newLevel: number) => void
  ) => void;
}
