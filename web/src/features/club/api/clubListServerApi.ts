"use server";
import { ClubInfo } from '../types';
// 서버 사이드에서 사용하는 함수
export const clubListServerApi = async (): Promise<ClubInfo[]> => {
    try {
      const response = await fetch(
        `${process.env.BASE_URL}/api/member/clubs`,
        {
          next: {
            revalidate: 60 * 60 * 1, // 1시간 캐시
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch club list");
      }
  
      const { response: { clubInfoList } } = await response.json();
      
      return clubInfoList;    
    } catch (error) {
      console.error("Failed to fetch club list", error);
      throw error;
    }
  };