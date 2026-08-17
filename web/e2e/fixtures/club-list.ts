import { okEnvelope } from "./envelope";

// 공개 club-list API 스냅샷
// 동아리 디렉터리 픽스처
export const CLUB_INFO_LIST = [
  { clubId: 1, school: "아주대", groupName: "녹두벌" },
  { clubId: 2, school: "홍익대", groupName: "들녘" },
  { clubId: 3, school: "연세대", groupName: "떼" },
  { clubId: 4, school: "이화여대", groupName: "매호씨" },
  { clubId: 5, school: "홍익대", groupName: "산틀" },
  { clubId: 6, school: "을지대", groupName: "새볏소리" },
  { clubId: 7, school: "홍익대", groupName: "신명화랑" },
  { clubId: 8, school: "이화여대", groupName: "어우리" },
  { clubId: 9, school: "상명대", groupName: "어우리짐 흥" },
  { clubId: 10, school: "홍익대", groupName: "악반" },
  { clubId: 11, school: "한국외대", groupName: "외침" },
  { clubId: 12, school: "이화여대", groupName: "풀이" },
  { clubId: 13, school: "고려대", groupName: "푸른소래" },
  { clubId: 14, school: "이화여대", groupName: "하날다래" },
  { clubId: 15, school: "한국외대", groupName: "한나래" },
  { clubId: 16, school: "한국외대", groupName: "한솔밥" },
  { clubId: 17, school: "동덕여대", groupName: "한소리" },
  { clubId: 18, school: "한기대", groupName: "한소리" },
  { clubId: 19, school: "이화여대", groupName: "휘모리" },
  { clubId: 20, school: "한국외대", groupName: "휘모리" },
  { clubId: 21, school: "성공회대", groupName: "탈" },
  { clubId: 22, school: "한성대", groupName: "탈" },
  { clubId: 23, school: "살판", groupName: "일상굿" },
  { clubId: 24, school: "없음", groupName: "없음" },
  { clubId: 25, school: "전통대", groupName: "울림" },
] as const;

export const SIGN_UP_CLUB = CLUB_INFO_LIST[0];

export const SIGN_UP_CLUB_OPTION_STR = `${SIGN_UP_CLUB.groupName} (${SIGN_UP_CLUB.school})`;

export const clubListCatalogResponse = okEnvelope({
  clubInfoList: [...CLUB_INFO_LIST],
});
