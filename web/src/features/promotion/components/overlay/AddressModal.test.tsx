import { createRef } from "react";

import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AddressModal, type AddressModalHandle } from "./AddressModal";

const sampleAddress = {
  latitude: 37.5,
  longitude: 127.0,
  detail: "지하 1층",
  buildingName: "홀",
};

describe("AddressModal", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("ref로 열면 지도 링크가 보이고 닫을 수 있다", async () => {
    const modalRef = createRef<AddressModalHandle>();

    render(<AddressModal address={sampleAddress} modalRef={modalRef} />);

    expect(
      screen.queryByLabelText("네이버 지도에서 위치 보기")
    ).not.toBeInTheDocument();

    act(() => {
      modalRef.current?.handleOpen();
    });

    const naver = await screen.findByLabelText("네이버 지도에서 위치 보기");
    expect(naver).toBeInTheDocument();
    expect(naver.getAttribute("href")).toContain("map.naver.com");
    expect(naver.getAttribute("href")).toContain(encodeURIComponent("지하 1층"));

    act(() => {
      modalRef.current?.handleClose();
    });

    expect(
      screen.queryByLabelText("네이버 지도에서 위치 보기")
    ).not.toBeInTheDocument();
  });
});
