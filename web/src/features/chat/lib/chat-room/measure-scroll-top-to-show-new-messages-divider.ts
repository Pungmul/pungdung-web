import { measureScrollTopToShowElement } from "./measure-scroll-top-to-show-element";
import { NEW_MESSAGES_DIVIDER_SELECTOR } from "../../constants/ui.constants";

export function measureScrollTopToShowNewMessagesDivider(
  scrollContainer: HTMLElement,
  messageContainer: HTMLElement
): number | null {
  const divider = messageContainer.querySelector<HTMLElement>(
    NEW_MESSAGES_DIVIDER_SELECTOR
  );
  if (!divider) {
    return null;
  }

  return measureScrollTopToShowElement(scrollContainer, divider, {
    align: "center",
  });
}
