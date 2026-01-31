import { SVGProps } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  FieldValues,
  Control,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

/**
 * 공통 아이콘 Props 타입
 * 모든 아이콘 컴포넌트에서 사용할 수 있는 기본 props
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  /** 아이콘 크기 */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  /** 접근성을 위한 제목 */
  title?: string;
  /** 접근성을 위한 제목 ID */
  titleId?: string;
}

export interface HookFormReturn<T extends FieldValues> {
  register: UseFormRegister<T>;
  inputErrors: FieldErrors<T>;
  isValid: boolean;
  handleSubmit: UseFormHandleSubmit<T>;
}

export interface HookFormCheckboxReturn<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  isValid: boolean;
  handleSubmit: UseFormHandleSubmit<T>;
}

export type FieldType = "year" | "month" | "day" | "hour" | "minute" | "second";

export interface Address {
  latitude: number;
  longitude: number;
  detail: string;
  buildingName: string;
}

export type ViewType = "webview" | "mobile" | "desktop";
