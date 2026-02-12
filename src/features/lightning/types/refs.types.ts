export interface LightningCardRefType {
  focus: () => void;
  blur: () => void;
}

export interface LightningBottomSheetRefType {
  getLevel: () => number;
  onLevelChange: (
    callback: (oldLevel: number, newLevel: number) => void
  ) => void;
}
