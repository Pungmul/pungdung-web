import { Children, isValidElement, type ReactNode } from "react";

import type { SelectorItem } from "./type";

interface SelectOptionElementProps<V> {
  children: ReactNode;
  value: V;
}

export function extractSelectItems<V>(
  children: ReactNode,
  selectOption: unknown
): SelectorItem<V>[] {
  const items: SelectorItem<V>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== selectOption) {
      return;
    }

    const { value, children: optionChildren } =
      child.props as SelectOptionElementProps<V>;

    items.push({
      label: String(optionChildren),
      value,
    });
  });

  return items;
}
