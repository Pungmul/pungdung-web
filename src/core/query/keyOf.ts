/** queryOptions 등 queryKey를 가진 객체에서 queryKey만 추출 */
export const keyOf = <T extends { queryKey: readonly unknown[] }>(o: T) =>
  o.queryKey;
