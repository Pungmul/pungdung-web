export async function searchPromotionAddress(address: string) {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("주소 검색 실패");
  }

  return response.json();
}
