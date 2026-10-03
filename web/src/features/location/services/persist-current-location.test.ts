import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/client", () => ({
  updateUserLocation: vi.fn(),
}));

import { updateUserLocation } from "../api/client";
import { locationStore } from "../store/locationStore";

import {
  alignStoreToServerLocation,
  persistCurrentLocationToServer,
  syncResolvedLocationToServer,
} from "./persist-current-location";

const updateUserLocationMock = vi.mocked(updateUserLocation);

describe("persistCurrentLocationToServer", () => {
  beforeEach(() => {
    updateUserLocationMock.mockReset();
    locationStore.getState().setLocationView({
      currentLocation: null,
      locationSource: null,
      locationLabel: null,
    });
  });

  it("좌표가 같으면 PATCH하지 않는다", async () => {
    const location = { latitude: 37.5, longitude: 127.0 };
    locationStore.getState().setResolvedLocation(location, "gps", null);

    await expect(persistCurrentLocationToServer(location)).resolves.toBe(
      "skipped"
    );
    expect(updateUserLocationMock).not.toHaveBeenCalled();
  });

  it("서버 위치가 없거나 200m 이상 차이 나면 GPS 위치를 전송한다", async () => {
    updateUserLocationMock.mockResolvedValue(undefined);
    locationStore.getState().setResolvedLocation({ latitude: 37.5, longitude: 127 }, "gps", null);

    await expect(persistCurrentLocationToServer(null)).resolves.toBe("written");
    await expect(persistCurrentLocationToServer({ latitude: 37.502, longitude: 127 })).resolves.toBe("written");
    expect(updateUserLocationMock).toHaveBeenCalledTimes(2);
  });

  it("서버 위치와 200m 미만 차이 나면 전송하지 않는다", async () => {
    locationStore.getState().setResolvedLocation({ latitude: 37.5, longitude: 127 }, "gps", null);

    await expect(persistCurrentLocationToServer({ latitude: 37.501, longitude: 127 })).resolves.toBe("skipped");
    expect(updateUserLocationMock).not.toHaveBeenCalled();
  });

  it("동시 요청은 이전 전송이 끝난 뒤 최신 위치를 전송한다", async () => {
    let finishFirst!: () => void;
    updateUserLocationMock.mockReturnValueOnce(new Promise<void>((resolve) => { finishFirst = resolve; }));
    updateUserLocationMock.mockResolvedValueOnce(undefined);
    locationStore.getState().setResolvedLocation({ latitude: 37.5, longitude: 127 }, "gps", null);
    const first = persistCurrentLocationToServer(null);
    locationStore.getState().setResolvedLocation({ latitude: 37.51, longitude: 127 }, "gps", null);
    const second = persistCurrentLocationToServer(null);
    expect(updateUserLocationMock).toHaveBeenCalledTimes(1);
    finishFirst();
    await Promise.all([first, second]);
    expect(updateUserLocationMock).toHaveBeenLastCalledWith({ latitude: 37.51, longitude: 127 });
  });

  it("GPS가 아니면 PATCH하지 않는다", async () => {
    locationStore
      .getState()
      .setResolvedLocation({ latitude: 37.6, longitude: 126.9 }, "school", "상명대");

    await expect(
      persistCurrentLocationToServer({ latitude: 37.5, longitude: 127.0 })
    ).resolves.toBe("skipped");
    expect(updateUserLocationMock).not.toHaveBeenCalled();
  });

  it("PATCH 실패면 failed다", async () => {
    locationStore
      .getState()
      .setResolvedLocation({ latitude: 37.6, longitude: 126.9 }, "gps", null);
    updateUserLocationMock.mockRejectedValue(new Error("fail"));

    await expect(
      persistCurrentLocationToServer({ latitude: 37.5, longitude: 127.0 })
    ).resolves.toBe("failed");
  });
});

describe("syncResolvedLocationToServer", () => {
  beforeEach(() => {
    updateUserLocationMock.mockReset();
    locationStore.getState().setLocationView({
      currentLocation: null,
      locationSource: null,
      locationLabel: null,
    });
  });

  it("PATCH 실패여도 GPS 출처는 유지한다", async () => {
    locationStore
      .getState()
      .setResolvedLocation({ latitude: 37.6, longitude: 126.9 }, "gps", null);
    updateUserLocationMock.mockRejectedValue(new Error("fail"));

    await expect(
      syncResolvedLocationToServer({ latitude: 37.5, longitude: 127.0 })
    ).resolves.toBe("failed");

    expect(locationStore.getState()).toMatchObject({
      currentLocation: { latitude: 37.6, longitude: 126.9 },
      locationSource: "gps",
      locationLabel: null,
    });
  });
});

describe("alignStoreToServerLocation", () => {
  it("서버 좌표로 맞추고 source를 비운다", () => {
    locationStore
      .getState()
      .setResolvedLocation({ latitude: 37.6, longitude: 126.9 }, "school", "상명대");

    alignStoreToServerLocation({ latitude: 37.5, longitude: 127.0 });

    expect(locationStore.getState()).toMatchObject({
      currentLocation: { latitude: 37.5, longitude: 127.0 },
      locationSource: null,
      locationLabel: null,
    });
  });
});
