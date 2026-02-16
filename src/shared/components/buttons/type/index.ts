import { ButtonHTMLAttributes } from "react";
import { LinkProps } from "next/link";


export interface LinkButtonProps extends LinkProps {
  className?: string;
  children: React.ReactNode;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}
