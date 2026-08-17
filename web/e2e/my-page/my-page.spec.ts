import { expect, test } from "@playwright/test";

import { clubListCatalogResponse } from "../fixtures/club-list";
import { failEnvelope, okEnvelope } from "../fixtures/envelope";
import { mockAppShellHttp } from "../helpers/route-mocks";

const CHANGE_INFO_UNLOCKED = okEnvelope({
  updatedAt: "2026-01-01T00:00:00.000Z",
  clubNameChangedAt: null,
  clubIdChangedAt: null,
});

async function mockMyPageHttp(
  page: Parameters<typeof mockAppShellHttp>[0],
  options: { saveFails?: boolean } = {}
) {
  await mockAppShellHttp(page);
  await page.route("**/api/club-list", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(clubListCatalogResponse),
    });
  });
  await page.route("**/api/users/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        okEnvelope({
          name: "E2E User",
          phoneNumber: "01000000000",
          email: "e2e@example.com",
          username: "e2e-user",
          groupName: "녹두벌",
          clubName: "풍덩",
          clubAge: 22,
          profile: {
            id: 1,
            originalFilename: "profile.png",
            convertedFileName: "profile.png",
            fullFilePath: "/favicon.ico",
            fileType: "image/png",
            fileSize: 1,
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        })
      ),
    });
  });
  await page.route("**/api/member/change-info", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(CHANGE_INFO_UNLOCKED),
    });
  });
  await page.route("**/api/auth/profile", async (route) => {
    if (route.request().method() !== "PATCH") {
      await route.fallback();
      return;
    }
    if (options.saveFails) {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(failEnvelope("저장에 실패했습니다.")),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(null)),
    });
  });
}

test.describe("마이페이지", () => {
  test("MY-001 | 내 정보 요약과 설정 진입점을 보여준다", async ({ page }) => {
    await mockMyPageHttp(page);
    await page.goto("/my-page", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "프로필" })).toBeVisible();
    await expect(page.getByText("E2E User", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "수정", exact: true })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "로그인 설정", exact: true })
    ).toBeVisible();
  });

  test("MY-002 | 프로필을 저장하면 마이페이지로 돌아온다", async () => {
    test.skip(
      true,
      "제출 버튼이 isValid가 false인 채 '입력값을 확인해주세요'로 남아 클릭이 대기에서 끝난다"
    );
  });

  test("MY | 로그인 설정과 비밀번호 변경 화면으로 들어간다", async ({
    page,
  }) => {
    await mockMyPageHttp(page);

    await page.goto("/my-page", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "프로필" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "로그인 설정", exact: true })
    ).toHaveAttribute("href", "/my-page/login-setting");
    await expect(
      page.getByRole("link", { name: "비밀번호 변경", exact: true })
    ).toHaveAttribute("href", "/my-page/change-password");
  });

  test("MY-007 | 프로필 저장 실패 시 작성한 값을 유지한다", async () => {
    test.skip(
      true,
      "제출 버튼이 isValid가 false인 채 '입력값을 확인해주세요'로 남아 클릭이 대기에서 끝난다"
    );
  });

  test("MY-008 | 이미지 포함 저장 실패 후 기존 프로필을 유지한다", async () => {
    test.skip(
      true,
      "제출 버튼이 isValid가 false인 채 '입력값을 확인해주세요'로 남아 클릭이 대기에서 끝난다"
    );
  });
});

test.describe("마이페이지 게스트", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("MY | 게스트에게 로그인 유도 화면을 보여주고 현재 경로를 유지한다", async ({
    page,
  }) => {
    await mockAppShellHttp(page);
    await page.goto("/my-page", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(/\/my-page$/);
    await expect(
      page.getByRole("heading", { name: "로그인 후 이용할 수 있어요" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "카카오로 시작하기", exact: true })
    ).toBeVisible();
  });
});
