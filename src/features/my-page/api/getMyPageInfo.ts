import type { Member } from "@/features/user";

export const getMyPageInfo = async (): Promise<Member> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/users/me`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("비정상 동작");
  }

  return response.json();
};

