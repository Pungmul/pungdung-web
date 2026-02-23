import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QuestionOptionFieldRow } from "./QuestionOptionFieldRow";

describe("QuestionOptionFieldRow", () => {
  it("marker·field·trailing을 순서대로 렌더한다", () => {
    render(
      <QuestionOptionFieldRow
        marker={<span data-testid="marker">①</span>}
        field={<input aria-label="option-label" />}
        trailing={<button type="button">삭제</button>}
      />
    );

    expect(screen.getByTestId("marker")).toHaveTextContent("①");
    expect(screen.getByLabelText("option-label")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });

  it("trailing 없이도 렌더한다", () => {
    render(
      <QuestionOptionFieldRow
        marker={<span>M</span>}
        field={<span>F</span>}
      />
    );

    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
  });
});
