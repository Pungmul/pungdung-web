import type { Address } from "@/shared/types";

export const addressToString = (address: Address) => {
  return `${address.buildingName}, ${address.detail}`;
};
