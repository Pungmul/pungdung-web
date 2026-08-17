import { expect, test } from "@playwright/test";

import { mockFriendsHttp } from "../helpers/friends-route-mocks";

test("FRIEND-002 | 검색한 사용자에게 친구를 요청한다", async ({ page }) => {
  await mockFriendsHttp(page);

  await page.goto("/my-page/friends/find");
  await page.getByPlaceholder("친구 검색").fill("친구유저");
  await page.getByText("친구유저", { exact: true }).click();
  await expect(page.getByRole("dialog", { name: "사용자 프로필" })).toBeVisible();
  await page.getByRole("button", { name: "친구 신청", exact: true }).click();
  await expect(page.getByText("친구 요청 완료")).toBeVisible();
});

test("FRIEND-007 | 친구 요청 실패 후 상태를 유지한다", async ({ page }) => {
  await mockFriendsHttp(page, { requestFails: true });

  await page.goto("/my-page/friends/find");
  await page.getByPlaceholder("친구 검색").fill("친구유저");
  await page.getByText("친구유저", { exact: true }).click();
  await page.getByRole("button", { name: "친구 신청", exact: true }).click();
  await expect(page.getByText("친구 요청 실패")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "친구 신청", exact: true })
  ).toBeVisible();
  await expect(page.getByText("친구 요청 완료")).toHaveCount(0);
});

test("FRIEND-003 | 받은 요청을 수락하면 친구 목록에 반영된다", async ({
  page,
}) => {
  await mockFriendsHttp(page, { withIncoming: true });

  await page.goto("/my-page/friends");
  await page.getByRole("button", { name: "받은 요청" }).click();
  await expect(page.getByText("요청유저", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "친구 요청 수락" }).click();
  await expect(page.getByText("친구 수락 완료")).toBeVisible();
  await page.getByRole("button", { name: "친구" }).click();
  await expect(page.getByText("요청유저", { exact: true })).toBeVisible();
});

test("FRIEND-004 | 받은 요청을 거절하면 목록에서 사라진다", async ({ page }) => {
  await mockFriendsHttp(page, { withIncoming: true });

  await page.goto("/my-page/friends");
  await page.getByRole("button", { name: "받은 요청" }).click();
  await page.getByRole("button", { name: "친구 요청 거절" }).click();
  await expect(page.getByText("친구 거절 완료")).toBeVisible();
  await expect(
    page.getByText("새로운 친구 요청이 없습니다.", { exact: true })
  ).toBeVisible();
});

test("FRIEND | 차단은 준비 중 안내만 보여준다", async ({ page }) => {
  await mockFriendsHttp(page);
  await page.goto("/my-page/friends");
  await page.getByRole("button", { name: "친구 메뉴", exact: true }).click();
  await page.getByRole("menuitem", { name: "차단", exact: true }).click();
  await expect(page.getByText("차단 기능은 준비 중입니다.")).toBeVisible();
  await expect(page).toHaveURL(/\/my-page\/friends/);
});

test("FRIEND-006 | 본인 검색 결과에서는 친구 신청을 막는다", async () => {
  test.skip(
    true,
    "검색 결과 프로필은 friendStatus만 열어 본인 CTA 분기가 없다"
  );
});

test("FRIEND | 보낸 요청 취소 화면", async () => {
  test.skip(true, "보낸 요청 취소 로직이 아직 연결되지 않았다");
});
