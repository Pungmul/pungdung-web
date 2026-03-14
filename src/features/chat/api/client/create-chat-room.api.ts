import {
  createChatRoomFailureDtoSchema,
  createChatRoomResponseDtoSchema,
  isCreateChatRoomFailure,
} from "./dto.schema";

function parseCreateChatRoomResponse(data: unknown) {
  const parsed = createChatRoomResponseDtoSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("비정상 동작");
  }
  if (isCreateChatRoomFailure(parsed.data)) {
    throw new Error(parsed.data.message);
  }
  return parsed.data;
}

/** HTTP 에러 본문이 `{ isSuccess: false, message, ... }` 형태면 그 메시지를 사용 (PROXY_FAILURE 등) */
function throwIfCreateChatRoomHttpError(response: Response, data: unknown) {
  if (response.ok) return;

  const failure = createChatRoomFailureDtoSchema.safeParse(data);
  if (failure.success) {
    throw new Error(failure.data.message);
  }
  throw new Error("비정상 동작");
}

async function postCreateChatRoom(path: string, body: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("비정상 동작");
  }

  throwIfCreateChatRoomHttpError(response, data);
  return parseCreateChatRoomResponse(data);
}

export async function createPersonalChatRoom(body: { receiverName: string }) {
  return postCreateChatRoom("/api/chats/create/personal", body);
}

export async function createMultiChatRoom(body: { receiverNameList: string[] }) {
  if (body.receiverNameList.length === 0) {
    throw new Error("친구를 선택해주세요");
  }

  return postCreateChatRoom("/api/chats/create/multi", body);
}
