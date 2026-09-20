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

function ClubSelect({
  onBlur,
  disabled = false,
  hasSearch = true,
}: {
  onBlur: () => void;
  disabled?: boolean;
  hasSearch?: boolean;
}) {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div>
      <Select
        name="club"
        label="소속패"
        hasSearch={hasSearch}
        disabled={disabled}
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

  it("비활성 Select는 숨김 form 필드도 비활성화한다", () => {
    render(<ClubSelect disabled onBlur={vi.fn()} />);

    expect(document.querySelector("select[name='club']")).toBeDisabled();
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

  it("검색 없는 셀렉트는 방향키와 Enter로 옵션을 선택한다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect hasSearch={false} onBlur={onBlur} />);

    const trigger = screen.getByRole("combobox", { name: /소속패/ });
    await user.click(trigger);
    await user.keyboard("{ArrowDown}{Enter}");

    expect(screen.getByRole("combobox", { name: /홍풍/ })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("검색 결과를 방향키와 Enter로 선택한다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect onBlur={onBlur} />);

    await user.click(screen.getByRole("button", { name: /소속패/ }));
    const searchInput = screen.getByPlaceholderText("소속패 검색");
    await user.type(searchInput, "홍");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(screen.getByRole("button", { name: /홍풍/ })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("검색형 셀렉트는 Enter로 열고 검색창으로 포커스를 옮긴다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect onBlur={onBlur} />);

    const trigger = screen.getByRole("button", { name: /소속패/ });
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByPlaceholderText("소속패 검색")).toHaveFocus();
  });

  it("검색 결과가 없을 때 Enter를 눌러도 검색창에 포커스를 유지한다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect onBlur={onBlur} />);

    await user.click(screen.getByRole("button", { name: /소속패/ }));
    const searchInput = screen.getByPlaceholderText("소속패 검색");
    await user.type(searchInput, "없는 동아리");
    await user.keyboard("{Enter}");

    expect(searchInput).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("검색 결과가 없습니다");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("검색형 옵션을 마우스로 선택해도 트리거로 포커스를 돌린다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect onBlur={onBlur} />);

    await user.click(screen.getByRole("button", { name: /소속패/ }));
    await user.click(screen.getByRole("option", { name: "홍풍" }));

    expect(screen.getByRole("button", { name: /홍풍/ })).toHaveFocus();
  });

  it("검색어 지우기 버튼에서 Escape를 누르면 트리거로 포커스를 돌린다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect onBlur={onBlur} />);

    await user.click(screen.getByRole("button", { name: /소속패/ }));
    await user.type(screen.getByPlaceholderText("소속패 검색"), "홍");
    const clearButton = screen.getByRole("button", { name: "검색어 지우기" });
    clearButton.focus();
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: /소속패/ })).toHaveFocus();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("Escape는 선택값을 바꾸지 않고 목록을 닫아 트리거로 포커스를 돌린다", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(<ClubSelect hasSearch={false} onBlur={onBlur} />);

    const trigger = screen.getByRole("combobox", { name: /소속패/ });
    await user.click(trigger);
    await user.keyboard("{ArrowDown}{Escape}");

    expect(trigger).toHaveFocus();
    expect(screen.getByRole("combobox", { name: /소속패/ })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
