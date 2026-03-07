import type { ReactNode } from "react";

export type FindFriendShellProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};
