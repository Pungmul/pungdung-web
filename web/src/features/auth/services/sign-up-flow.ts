export function getNextStepInOrder<S extends string>(
  order: readonly S[],
  current: S
): S | undefined {
  const i = order.indexOf(current);
  if (i === -1 || i >= order.length - 1) return undefined;
  return order[i + 1];
}

export function getPreviousStepInOrder<S extends string>(
  order: readonly S[],
  current: S
): S | undefined {
  const i = order.indexOf(current);
  if (i <= 0) return undefined;
  return order[i - 1];
}
