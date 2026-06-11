import type { User } from "@/features/user";

import type { UserImageMap } from "../../types";

export const createUserImageMap = (userList: User[]): UserImageMap => {
  return userList.reduce((acc, user) => {
    acc[user.username] = user.profileImage?.fullFilePath || "";
    return acc;
  }, {} as UserImageMap);
};
