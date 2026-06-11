export const updateUserLocation = async (
  latitude: number,
  longitude: number
): Promise<void> => {
  try {
    const proxyUrl = `/api/location`;

    const response = await fetch(proxyUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) throw new Error("서버 불안정" + response.status);

    return;
  } catch (error) {
    console.error("사용자 위치 업데이트 중 에러:", error);
    throw error;
  }
}; 