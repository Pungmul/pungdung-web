import { clientApiRequest } from "@/core/api/client";

import { voidResponseSchema } from "./dto.schema";

export const updateProfile = async (formData: FormData): Promise<void> =>
  clientApiRequest({
    url: "/api/auth/profile",
    method: "PATCH",
    body: formData,
    responseSchema: voidResponseSchema,
  });
