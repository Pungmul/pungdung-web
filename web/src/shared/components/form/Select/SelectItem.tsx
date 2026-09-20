import type { SelectorItem } from "./type";

interface SelectItemProps<V> {
  id: string;
  isActive: boolean;
  item: SelectorItem<V>;
  onSelect: (item: SelectorItem<V>) => void;
  selectedValue: V | null | undefined;
}

export function SelectItem<V>({
  id,
  isActive,
  item,
  onSelect,
  selectedValue,
}: SelectItemProps<V>) {
  const isSelected = item.value === selectedValue;

  return (
    <li
      id={id}
      role="option"
      aria-selected={isSelected}
      className={`group w-full cursor-pointer px-2 py-1 text-[14px] leading-5 ${isActive ? "bg-grey-100" : ""}`}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={() => onSelect(item)}
    >
      <div
        className={`w-full cursor-pointer rounded-sm px-2 py-2.5 text-[14px] leading-5 group-hover:bg-grey-100 ${isSelected ? "bg-grey-100 font-semibold text-grey-800" : "text-grey-500"}`}
      >
        {item.label}
      </div>
    </li>
  );
}
