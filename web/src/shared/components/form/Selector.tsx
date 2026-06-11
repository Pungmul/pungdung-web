"use client";

import { InputHTMLAttributes } from "react";

import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { Select } from "./Select";

export interface SelectorItem<T> {
  label: string;
  value: T | null;
}

interface SelectorProps<T extends FieldValues, V extends T[keyof T]>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  control: Control<T>;
  name: Path<T>;
  items: SelectorItem<V>[];
  label: string;
  hasSearch?: boolean;
  placeholder?: string;
  className?: string;
  errorMessage?: string | undefined;
  // onChange?: ((value: V | null) => void) | undefined;
}

export function Selector<T extends FieldValues, V extends T[keyof T]>({
  items,
  hasSearch = false,
  label,
  name,
  errorMessage,
  // onChange,
  control,
  ...rest
}: SelectorProps<T, V>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          name={name}
          label={label}
          hasSearch={hasSearch}
          errorMessage={errorMessage}
          onChange={(value) => {
            field.onChange(value);
          }}
          {...rest}
          value={field.value}
        >
          {items.map((item, index) => (
            <Select.Option key={index} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      )}
    />
  );
}
