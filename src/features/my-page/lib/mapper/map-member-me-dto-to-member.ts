import type { Member } from "@/features/user";

import type { MemberMeDto } from "@/features/my-page/api/client/dto.schema";

export function mapMemberMeDtoToMember(payload: MemberMeDto): Member {
  const member: Member = {
    name: payload.name,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
    username: payload.username,
    profile: payload.profile,
  };

  if (payload.loginId != null && payload.loginId !== "") {
    member.loginId = payload.loginId;
  }
  if (payload.birth != null && payload.birth !== "") {
    member.birth = payload.birth;
  }
  if (payload.clubAge != null) {
    member.clubAge = payload.clubAge;
  }
  if (payload.groupName != null) {
    member.groupName = payload.groupName;
  }
  if (payload.clubName != null && payload.clubName !== "") {
    member.clubName = payload.clubName;
  }
  if (payload.area != null && payload.area !== "") {
    member.area = payload.area;
  }

  return member;
}
