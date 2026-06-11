import { describe, expect, it } from "vitest";

import {
  mapFriendStatusToProfileRelationship,
  mapFriendStatusToRelationHint,
  parseFriendApiRelationKind,
} from "./friend-status";

describe("parseFriendApiRelationKind", () => {
  it("대소문자·공백을 무시하고 알려진 값을 파싱한다", () => {
    expect(parseFriendApiRelationKind("  accepted  ")).toBe("ACCEPTED");
    expect(parseFriendApiRelationKind("send")).toBe("SEND");
  });

  it("알 수 없는 값은 UNKNOWN이다", () => {
    expect(parseFriendApiRelationKind("")).toBe("UNKNOWN");
    expect(parseFriendApiRelationKind("WEIRD")).toBe("UNKNOWN");
  });
});

describe("mapFriendStatusToProfileRelationship", () => {
  it("모달 relationship 과 일치한다", () => {
    expect(mapFriendStatusToProfileRelationship("ACCEPTED")).toBe("friend");
    expect(mapFriendStatusToProfileRelationship("SEND")).toBe("pending_out");
    expect(mapFriendStatusToProfileRelationship("RECEIVE")).toBe("pending_in");
    expect(mapFriendStatusToProfileRelationship("NONE")).toBe("none");
    expect(mapFriendStatusToProfileRelationship("UNKNOWN")).toBe("none");
  });
});

describe("mapFriendStatusToRelationHint", () => {
  it("NONE·UNKNOWN 은 빈 문자열", () => {
    expect(mapFriendStatusToRelationHint("NONE")).toBe("");
    expect(mapFriendStatusToRelationHint("x")).toBe("");
  });

  it("관계별 짧은 힌트", () => {
    expect(mapFriendStatusToRelationHint("ACCEPTED")).toBe("친구");
    expect(mapFriendStatusToRelationHint("SEND")).toBe("요청 보냄");
    expect(mapFriendStatusToRelationHint("RECEIVE")).toBe("요청 받음");
  });
});
