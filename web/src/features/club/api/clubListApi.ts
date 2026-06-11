import { ClubInfo } from '../types';

export const clubListApi = async (): Promise<ClubInfo[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/club-list`,
      {
        credentials: "include", // 쿠키 포함
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch club list");
    }

    const {
      response: { clubInfoList },
    } = await response.json();

    return clubInfoList;
  } catch (error) {
    console.error("Failed to fetch club list", error);
    throw error;
  }
};

// [
//             {
//                 "clubId": 1,
//                 "school": "상명대",
//                 "clubName": "어흥"
//             },]
