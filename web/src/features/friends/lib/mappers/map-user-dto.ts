import type { z } from "zod";

import type { User } from "@/features/user";

import { userDtoSchema } from "../../api/client/dto.schema";

type UserDtoParsed = z.infer<typeof userDtoSchema>;

/** DTO → 도메인 User (`exactOptionalPropertyTypes` 대응: clubName 은 undefined 면 키 생략) */
export function mapUserDto(dto: UserDtoParsed): User {
  const base: User = {
    userId: dto.userId,
    username: dto.username,
    name: dto.name,
    profileImage: dto.profileImage,
  };
  if (dto.clubName !== undefined) {
    return { ...base, clubName: dto.clubName };
  }
  return base;
}
