export async function createPersonalChatRoom(body: { receiverName: string }) {
  try {
    const response = await fetch("/api/chats/create/personal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!response.ok) throw Error("비정상 동작");

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
    alert("비정상 동작");
  }
}

export async function createMultiChatRoom(body: { receiverNameList: string[] }) {
  try {
    if (body.receiverNameList.length === 0) throw Error("친구를 선택해주세요");

    const response = await fetch("/api/chats/create/multi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!response.ok) throw Error("비정상 동작");

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
    alert("비정상 동작");
  }
}
