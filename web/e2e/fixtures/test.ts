import { expect,test as base } from "@playwright/test";

// pwa 프로젝트에서 display-mode: standalone 매칭을 흉내 낸다.
export const test = base.extend({
  context: async ({ context }, use, testInfo) => {
    if (testInfo.project.name === "pwa") {
      await context.addInitScript(() => {
        const originalMatchMedia = window.matchMedia.bind(window);
        window.matchMedia = ((query: string) => {
          if (query.includes("display-mode: standalone")) {
            return {
              matches: true,
              media: query,
              onchange: null,
              addListener() {},
              removeListener() {},
              addEventListener() {},
              removeEventListener() {},
              dispatchEvent() {
                return false;
              },
            } as MediaQueryList;
          }
          return originalMatchMedia(query);
        }) as typeof window.matchMedia;
      });
    }
    // Playwright fixture 콜백
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture
    await use(context);
  },
});

export { expect };
