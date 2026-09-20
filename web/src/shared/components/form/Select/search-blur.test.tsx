import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Select } from "./Select";

function flushBlurFrame() {
  return act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function ClubSelect({ onBlur }: { onBlur: () => void }) {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div>
      <Select
        name="club"
        label="소속패"
        hasSearch
        value={value}
        onChange={setValue}
        onBlur={onBlur}
      >
        <Select.Option value="pungdung">풍덩</Select.Option>
        <Select.Option value="hongpung">홍풍</Select.Option>
      </Select>
      <button type="button">바깥</button>
    </div>
  );
}

describe("Select 검색 포커스", () => {
  afterEach(() => {
    cleanup();
  });

  it("검색 인풋으로 포커스가 옮겨도 onBlur를 호출하지 않는다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect onBlur={onBlur} />);

    await user.click(screen.getByRole("button", { name: /소속패/ }));
    await user.click(screen.getByPlaceholderText("소속패 검색"));
    await flushBlurFrame();

    expect(onBlur).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText("소속패 검색")).toHaveFocus();
  });

  it("검색 후 옵션을 고르면 선택값이 반영된다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect onBlur={onBlur} />);

    await user.click(screen.getByRole("button", { name: /소속패/ }));
    await user.type(screen.getByPlaceholderText("소속패 검색"), "홍");
    await flushBlurFrame();
    expect(onBlur).not.toHaveBeenCalled();

    await user.click(screen.getByRole("option", { name: "홍풍" }));
    await flushBlurFrame();

    expect(screen.getByRole("button", { name: /홍풍/ })).toBeInTheDocument();
    expect(onBlur).not.toHaveBeenCalled();
  });

  it("셀렉트 밖으로 포커스가 나가면 onBlur를 호출한다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect onBlur={onBlur} />);

    await user.click(screen.getByRole("button", { name: /소속패/ }));
    await user.click(screen.getByPlaceholderText("소속패 검색"));
    await user.click(screen.getByRole("button", { name: "바깥" }));
    await flushBlurFrame();

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
