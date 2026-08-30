import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FriendBox, FriendMenu, FriendMessageButton } from "@/features/friends";

import { Button } from "@/shared";

import { JoinedFriendsSheet } from "./JoinedFriendsSheet";
import type { PromotionJoinedFriend } from "../../../types";

const friends: PromotionJoinedFriend[] = [
  {
    userId: 3,
    username: "ajtwoddl1236@naver.com",
    name: "강윤호",
    clubName: "이",
    profileImage: {
      id: 2,
      originalFilename: "pungdeong.png",
      convertedFileName: "pungdeong.png",
      fullFilePath: "/logos/pungdeong_logo_192.png",
      fileType: "image/png",
      fileSize: 1,
      createdAt: "2026-09-22T00:00:00",
    },
  },
  {
    userId: 4,
    username: "friend@example.com",
    name: "공연 친구",
    clubName: "풍덩대",
    profileImage: {
      id: 3,
      originalFilename: "pungdeong.png",
      convertedFileName: "pungdeong.png",
      fullFilePath: "/logos/pungdeong_logo_192.png",
      fileType: "image/png",
      fileSize: 1,
      createdAt: "2026-09-22T00:00:00",
    },
  },
];

function StoryJoinedFriendsList({
  friends,
}: {
  friends: PromotionJoinedFriend[];
}) {
  return (
    <div className="flex flex-col">
      {friends.map((friend) => (
        <FriendBox
          key={friend.userId}
          className="hover:bg-grey-100 max-md:px-1"
          friend={friend}
          onOpen={() => {}}
          buttons={
            <>
              <FriendMessageButton onClick={() => {}} />
              <FriendMenu
                items={[
                  { label: "친구 삭제", handler: () => {} },
                  { label: "차단", handler: () => {} },
                  { label: "신고", handler: () => {} },
                ]}
              />
            </>
          }
        />
      ))}
    </div>
  );
}

function renderStory(args: Parameters<typeof JoinedFriendsSheet>[0]) {
  return (
    <JoinedFriendsSheet
      {...args}
      friendList={<StoryJoinedFriendsList friends={args.friends} />}
    />
  );
}

const meta = {
  title: "features/promotion/JoinedFriendsSheet",
  component: JoinedFriendsSheet,
  args: {
    friends,
  },
  render: renderStory,
  decorators: [
    (Story) => (
      <div className="w-[342px] bg-background px-[24px] py-[16px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JoinedFriendsSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ManyFriends: Story = {
  args: {
    friends: [...friends, { ...friends[0]!, userId: 5, name: "풍덩이" }],
  },
};

export const WithSubmitButton: Story = {
  render: (args) => (
    <JoinedFriendsSheet
      {...args}
      friendList={<StoryJoinedFriendsList friends={args.friends} />}
    >
      <div className="bg-gradient-to-t from-background via-background via-80% to-transparent px-[24px] pb-[32px] pt-[24px]">
        <Button type="button" className="bg-blue-600 text-white">
          설문 제출하기
        </Button>
      </div>
    </JoinedFriendsSheet>
  ),
};
