"use client";
import { Header } from "@pThunder/shared";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Responsive } from "@pThunder/shared/components/Responsive";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useBoardList } from "../../queries";

interface BoardHeaderProps {
  boardID: string;
  initialView?: "mobile" | "desktop";
  initialBoardInfo?: {
    name: string;
    description: string;
  };
}

export default function BoardHeader({
  boardID,
  initialView,
  initialBoardInfo,
}: BoardHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: boardList } = useBoardList();
  const router = useRouter();

  const boardInfo = useMemo(() => {
    if (boardID === "my-post")
      return {
        name: "내 게시글",
        description: "내가 작성한 게시글 목록 입니다.",
      };
    if (boardID === "my-comment")
      return {
        name: "내 댓글",
        description: "내가 작성한 댓글 목록 입니다.",
      };
    if (boardID === "upcoming-performance")
      return {
        name: "관람 예정인 공연",
        description: "관람 예정인 공연 목록 입니다.",
      };

    if (boardID === "hot-post")
      return {
        name: "인기 게시글",
        description: "인기 게시글 목록 입니다.",
      };

    if (initialBoardInfo) {
      return initialBoardInfo;
    }

    return boardList?.find(
      (board) => board.id === Number(boardID) || boardID === board.id
    );
  }, [boardList, boardID, initialBoardInfo]);

  return (
    <Responsive
      {...(initialView ? { initialView } : {})}
      mobile={
        <nav className="flex flex-col sticky top-0 z-20 bg-background">
          <Header
            title={boardInfo?.name || "알 수 없는 게시판"}
            rightBtn={
              <MagnifyingGlassIcon
                className="w-[24px] h-[24px]"
                color="#CCC"
                width={24}
                height={24}
                onClick={() => {
                  setIsSearching(true);
                }}
              />
            }
            onLeftClick={() => {
              router.replace("/board/main", { scroll: false });
            }}
            className="z-20"
          />
          {isSearching && (
            <div className="flex flex-row gap-[8px] px-[12px] py-[4px] bg-background ">
              <div className="flex flex-row gap-[8px] p-[8px] rounded-md bg-grey-200 border border-grey-200 focus-within:border-grey-400 w-full">
                <input
                  type="text"
                  className="flex-grow bg-transparent outline-none peer font-light"
                  placeholder="검색"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
                {searchValue.trim() !== "" && (
                  <>
                    <XCircleIcon
                      className="w-[24px] h-[24px] cursor-pointer peer text-grey-400"
                      width={24}
                      height={24}
                      onClick={() => {
                        setIsSearching(false);
                        setSearchValue("");
                      }}
                    />
                    <ArrowRightIcon
                      className="w-[24px] h-[24px] cursor-pointer text-grey-400"
                      onClick={() => {
                        router.push(`/board/${Number(boardID)}/search?keyword=${searchValue}`);
                      }}
                      width={24}
                      height={24}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      }
      desktop={
        <div className="flex flex-row justify-between gap-[12px] mx-auto w-full px-[24px] max-w-[960px] py-[48px] bg-background">
          <div className="flex flex-col gap-[8px]">
            <h1 className="text-[27px] font-normal">
              {boardInfo?.name || "알 수 없는 게시판"}
            </h1>
            <div className="text-[14px] text-grey-500">
              {boardInfo?.description || "알 수 없는 게시판"}
            </div>
          </div>

          <div className="flex flex-row gap-[8px] p-[8px] h-fit rounded-md bg-grey-200 border border-grey-200 focus-within:border-grey-400 w-[320px]">
            <input
              type="text"
              className="bg-transparent outline-none peer font-light flex-grow"
              placeholder="검색"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
            {searchValue.trim() !== "" && (
              <>
                <XCircleIcon
                  className="w-[24px] h-[24px] cursor-pointer peer text-grey-400"
                  width={24}
                  height={24}
                  onClick={() => {
                    setIsSearching(false);
                    setSearchValue("");
                  }}
                />
                <ArrowRightIcon
                  className="w-[24px] h-[24px] cursor-pointer text-grey-400"
                  onClick={() => {
                    router.push(`/board/${Number(boardID)}/search?keyword=${searchValue}`);
                  }}
                  width={24}
                  height={24}
                />
              </>
            )}
          </div>
        </div>
      }
    />
  );
}
