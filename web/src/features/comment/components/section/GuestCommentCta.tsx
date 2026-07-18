import { LinkChipButton } from "@/shared/components";

type GuestCommentCtaProps = {
  loginHref: string;
};

export function GuestCommentCta({ loginHref }: GuestCommentCtaProps) {
  return (
    <section className="flex min-h-[340px] w-full flex-1 flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="text-m1 text-grey-500">
        가입하고 사람들의 반응을 살펴보세요.
      </p>
      <LinkChipButton href={loginHref} filled>
        로그인하기
      </LinkChipButton>
    </section>
  );
}
