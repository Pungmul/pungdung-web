"use client";

import { Spinner } from "@/shared/components";
import ObserveTrigger from "@/shared/components/ObserveTrigger";

type OlderMessagesLoaderProps = {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  onTrigger: () => void;
};

const OLDER_MESSAGES_TRIGGER_CONDITION = { rootMargin: "100px" };

export function OlderMessagesLoader({
  hasNextPage,
  isFetchingNextPage,
  onTrigger,
}: OlderMessagesLoaderProps) {
  if (!hasNextPage) {
    return null;
  }

  return (
    <>
      <ObserveTrigger
        trigger={onTrigger}
        unmountCondition={!hasNextPage}
        triggerCondition={OLDER_MESSAGES_TRIGGER_CONDITION}
      />
      {isFetchingNextPage ? (
        <div className="flex flex-col items-center justify-center py-4">
          <Spinner size={36} />
        </div>
      ) : null}
    </>
  );
}
