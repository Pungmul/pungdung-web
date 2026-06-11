import type { User } from "@/features/user";

import type { UserNameMap } from "../../types";

export const createUserNameMap = (userList: User[]): UserNameMap => {
  return userList.reduce((acc, user) => {
    acc[user.username] = user.name || "";
    return acc;
  }, {} as UserNameMap);
};
