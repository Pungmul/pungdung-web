import React from "react";
import Image from "next/image";

interface ChatMessageProps {
  message: string;
  sideContent?: React.ReactNode;
  userImageUrl: string | null;
  senderUsername: string;
  isUser: boolean;
  isProfileRevealed?: boolean;
  onProfileClick?: () => void;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  sideContent,
  userImageUrl,
  senderUsername,
  isProfileRevealed = false,
  isUser,
  onProfileClick,
}) => {
  const profileAvatar = (
    <div className="size-[32px] bg-grey-100 rounded-full overflow-hidden relative">
      {userImageUrl ? (
        <Image src={userImageUrl} alt="user" fill loading="lazy" />
      ) : (
        <div className="size-[32px] bg-grey-200 rounded-full overflow-hidden" />
      )}
    </div>
  );

  return (
    <div className="px-[12px] flex flex-col gap-[4px] flex-grow">
      {!isUser && isProfileRevealed && (
        <p className="text-[10px] ml-[44px] lg:text-[13px] font-light text-grey-500">
          {senderUsername}
        </p>
      )}
      <div
        className={
          "flex items-center gap-[8px]" +
          (isUser ? " flex-row-reverse" : " flex-row")
        }
      >
        {!isUser &&
          (isProfileRevealed ? (
            onProfileClick ? (
              <button
                type="button"
                className="size-[32px] shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0"
                aria-label={`${senderUsername} 프로필 보기`}
                onClick={onProfileClick}
              >
                {profileAvatar}
              </button>
            ) : (
              profileAvatar
            )
          ) : (
            <div className="size-[32px]" />
          ))}

        <div
          className={
            "text-[13px] lg:text-[15px] font-medium px-[12px] w-fit max-w-[280px] md:max-w-[320px] py-[8px] rounded-[8px] lg:rounded-[12px] tracking-wide break-words whitespace-pre-wrap" +
            (isUser
              ? " bg-primary text-white"
              : " bg-grey-100 text-grey-700 border-grey-100 border-[1px]")
          }
        >
          {message}
        </div>
        <div className="self-end">{sideContent && <>{sideContent}</>}</div>
      </div>
    </div>
  );
};

export const ChatMessage = React.memo(ChatMessageComponent);
