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
    locationStore.getState().setResolvedLocation(location, "school", "상명대");

    await expect(persistCurrentLocationToServer(location)).resolves.toBe(
      "skipped"
    );
    expect(updateUserLocationMock).not.toHaveBeenCalled();
  });

  it("PATCH 실패면 failed다", async () => {
    locationStore
      .getState()
      .setResolvedLocation({ latitude: 37.6, longitude: 126.9 }, "school", "상명대");
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

  it("PATCH 실패면 스토어를 서버 좌표에 맞춘다", async () => {
    locationStore
      .getState()
      .setResolvedLocation({ latitude: 37.6, longitude: 126.9 }, "school", "상명대");
    updateUserLocationMock.mockRejectedValue(new Error("fail"));

    await expect(
      syncResolvedLocationToServer({ latitude: 37.5, longitude: 127.0 })
    ).resolves.toBe("failed");

    expect(locationStore.getState()).toMatchObject({
      currentLocation: { latitude: 37.5, longitude: 127.0 },
      locationSource: null,
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
