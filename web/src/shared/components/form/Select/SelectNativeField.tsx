import type { ChangeEvent } from "react";

import type { SelectorItem } from "./type";

interface SelectNativeFieldProps<V> {
  disabled?: boolean | undefined;
  items: SelectorItem<V>[];
  name: string;
  onChange?: ((value: V | null) => void) | undefined;
  placeholderText: string;
  value: V | null;
}

//실제 select 태그를 사용하는 컴포넌트
export function SelectNativeField<V>({
  disabled,
  items,
  name,
  onChange,
  placeholderText,
  value,
}: SelectNativeFieldProps<V>) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const item = items.find((candidate) => String(candidate.value) === event.target.value);
    onChange?.(item?.value as V | null);
  };

  return (
    <select
      id={name}
      name={name}
      tabIndex={-1}
      disabled={disabled}
      value={value === undefined || value === null || value === "" ? "placeholder" : String(value)}
      onChange={handleChange}
      className="sr-only"
      aria-hidden="true"
    >
      <option value="placeholder" disabled>
        {placeholderText}
      </option>
      {items.map((item, index) => (
        <option key={index} value={String(item.value)}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
