export const registerFCMToken = async (
  fcmToken: string,
  deviceInfo: string
) => {
  try {
    const response = await fetch("/api/notification/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fcmToken, deviceInfo }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("FCM 토큰 등록 성공:", result);
    return true;
  } catch (error) {
    console.error("FCM 토큰 등록 실패:", error);
    return false;
  }
};
