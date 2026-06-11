export type BottomSheetLevelHeights = {
  low: number;
  medium: number;
  high: number;
};

export const resolveNearestBottomSheetLevel = (
  visibleHeight: number,
  levels: BottomSheetLevelHeights
): number => {
  const candidates = [levels.low, levels.medium, levels.high];

  return candidates.reduce((nearest, candidate) => {
    const nearestDistance = Math.abs(nearest - visibleHeight);
    const candidateDistance = Math.abs(candidate - visibleHeight);

    return candidateDistance < nearestDistance ? candidate : nearest;
  });
};
