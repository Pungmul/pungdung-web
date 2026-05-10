import { describe, expect, it } from "vitest";

import { measureScrollTopToShowElement } from "./measure-scroll-top-to-show-element";

describe("measureScrollTopToShowElement", () => {
  it("target이 viewport 위에 있으면 scrollTop을 줄인다", () => {
    const scrollContainer = document.createElement("div");
    const target = document.createElement("li");

    scrollContainer.getBoundingClientRect = () =>
      ({
        top: 100,
        height: 400,
      }) as DOMRect;
    target.getBoundingClientRect = () =>
      ({
        top: 40,
        height: 24,
      }) as DOMRect;

    Object.defineProperty(scrollContainer, "scrollTop", {
      value: 0,
      writable: true,
    });
    Object.defineProperty(scrollContainer, "clientHeight", { value: 400 });

    expect(
      measureScrollTopToShowElement(scrollContainer, target, { align: "start" })
    ).toBe(-60);
  });

  it("center 정렬 시 viewport 중앙을 맞춘다", () => {
    const scrollContainer = document.createElement("div");
    const target = document.createElement("li");

    scrollContainer.getBoundingClientRect = () =>
      ({
        top: 0,
        height: 400,
      }) as DOMRect;
    target.getBoundingClientRect = () =>
      ({
        top: 200,
        height: 40,
      }) as DOMRect;

    Object.defineProperty(scrollContainer, "scrollTop", {
      value: 0,
      writable: true,
    });
    Object.defineProperty(scrollContainer, "clientHeight", { value: 400 });

    expect(
      measureScrollTopToShowElement(scrollContainer, target, { align: "center" })
    ).toBe(20);
  });
});
