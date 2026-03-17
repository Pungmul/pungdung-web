import { clientApiRequest } from "@/core/api/client";

import {
  parseUserFromUnknown,
  usersKeywordListResponseSchema,
} from "./dto.schema";
import type { User } from "../../types";

export async function fetchUsersByKeyword(keyword: string): Promise<User[]> {
  try {
    const qs = new URLSearchParams({ keyword });
    const data = await clientApiRequest({
      url: `/api/users?${qs.toString()}`,
      responseSchema: usersKeywordListResponseSchema,
    });
    const rows = Array.isArray(data) ? data : data.users;
    return rows
      .map((row) => parseUserFromUnknown(row))
      .filter((u): u is User => u != null);
  } catch {
    return [];
  }
}
