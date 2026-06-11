export interface TabItem {
  label: string;
  value: string;
}

export const PROMOTION_TABS: TabItem[] = [
  {
    label: "공연 목록",
    value: "promotion-list",
  },
  {
    label: "내 공연",
    value: "my-promotion-form-list",
  },
];
