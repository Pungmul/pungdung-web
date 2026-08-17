import { expect, test } from "@playwright/test";

import { mockFriendsHttp } from "../helpers/friends-route-mocks";

test("FRIEND-011 | 친구 목록이 비면 안내 문구를 보여준다", async ({ page }) => {
  await mockFriendsHttp(page, { emptyLists: true });
  await page.goto("/my-page/friends");
  await expect(
    page.getByText("아직 친구가 없습니다.", { exact: true })
  ).toBeVisible();
});

test("FRIEND-012 | 보낸 요청이 없으면 안내 문구를 보여준다", async ({
  page,
}) => {
  await mockFriendsHttp(page, { emptyLists: true });
  await page.goto("/my-page/friends");
  await page.getByRole("button", { name: "보낸 요청" }).click();
  await expect(
    page.getByText("보낸 요청이 없습니다.", { exact: true })
  ).toBeVisible();
});

test("FRIEND-021 | 검색 결과가 없으면 안내 문구를 보여준다", async ({
  page,
}) => {
  await mockFriendsHttp(page, { emptySearch: true });
  await page.goto("/my-page/friends/find");
  await page.getByPlaceholder("친구 검색").fill("없는사람");
  await expect(
    page.getByText("검색 결과가 없습니다.", { exact: true })
  ).toBeVisible();
});

test("FRIEND-013 | 친구를 검색하면 결과가 보인다", async ({ page }) => {
  await mockFriendsHttp(page);
  await page.goto("/my-page/friends/find");
  await page.getByPlaceholder("친구 검색").fill("친구유저");
  await expect(page.getByText("친구유저", { exact: true })).toBeVisible();
  await expect(page.getByText("friend-user", { exact: true })).toBeVisible();
});
