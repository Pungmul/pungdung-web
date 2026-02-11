import { describe, expect, it } from "vitest";

import { ClientApiError } from "./client-api-error";
import { ClientMapperError } from "./client-mapper-error";
import { withResponseMapper } from "./with-response-mapper";

describe("withResponseMapper", () => {
  it("ClientApiError는 그대로 전달한다", async () => {
    const apiError = new ClientApiError({
      message: "bad",
      status: 500,
      code: "SERVER",
    });

    await expect(
      withResponseMapper({
        context: "test",
        fetchDto: () => Promise.reject(apiError),
        map: (x: number) => x,
      })
    ).rejects.toBe(apiError);
  });

  it("매퍼가 던지면 ClientMapperError로 감싼다", async () => {
    await expect(
      withResponseMapper({
        context: "testMap",
        fetchDto: () => Promise.resolve(1),
        map: () => {
          throw new Error("map fail");
        },
      })
    ).rejects.toMatchObject({
      name: "ClientMapperError",
      context: "testMap",
    });
    try {
      await withResponseMapper({
        context: "testMap",
        fetchDto: () => Promise.resolve(1),
        map: () => {
          throw new Error("map fail");
        },
      });
    } catch (e) {
      expect(e).toBeInstanceOf(ClientMapperError);
      expect((e as ClientMapperError).failureCause).toBeInstanceOf(Error);
    }
  });
});
