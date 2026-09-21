import { NextResponse } from "next/server";

import { enqueueCookieMutation } from "../cookie";
import {
  PENDING_INVITATION_COOKIE,
  PENDING_INVITATION_MAX_AGE,
  readPendingInvitationCode,
} from "../pending-invitation";
import type { MiddlewareHandler } from "../types";

// /invite?inviteCode= 를 검증해 쿠키로 심고 /home 으로 보냄
export const inviteCodeHandler: MiddlewareHandler = (ctx) => {
  if (ctx.pathname !== "/invite") {
    return null;
  }

  const destination = new URL("/home", ctx.req.url);
  const invitationCode = readPendingInvitationCode(
    ctx.req.nextUrl.searchParams.get("inviteCode") ?? undefined
  );

  if (!invitationCode) {
    return NextResponse.redirect(destination, 302);
  }

  enqueueCookieMutation(ctx, {
    type: "set",
    name: PENDING_INVITATION_COOKIE,
    value: invitationCode,
    options: {
      httpOnly: true,
      maxAge: PENDING_INVITATION_MAX_AGE,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  });

  return NextResponse.redirect(destination, 302);
};
