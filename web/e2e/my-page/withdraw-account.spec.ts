import { test } from "@playwright/test";

test.skip(
  true,
  "제품에 회원 탈퇴 화면과 API가 없어 MY-009, MY-010, MY-011을 작성하지 않는다"
);

test("MY-009 | 탈퇴 취소 시 요청을 보내지 않는다", async () => {});

test("MY-011 | 탈퇴 실패 후에도 로그인을 유지한다", async () => {});
