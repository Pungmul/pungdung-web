import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "worker-socket-bridge",
    description:
      "Worker-backed STOMP socket bridge — RPC, runtime fallback, React integration",
    lang: "ko-KR",
    head: [["meta", { name: "theme-color", content: "#1e6bb8" }]],
    mermaid: {
      theme: "default",
    },
    themeConfig: {
      nav: [
        { text: "홈", link: "/" },
        { text: "가이드", link: "/guide/getting-started" },
        { text: "모듈", link: "/modules/client" },
      ],
      sidebar: {
        "/guide/": [
          {
            text: "가이드",
            items: [
              { text: "시작하기", link: "/guide/getting-started" },
              { text: "아키텍처", link: "/guide/architecture" },
            ],
          },
        ],
        "/modules/": [
          {
            text: "모듈",
            items: [
              { text: "protocol", link: "/modules/protocol" },
              { text: "rpc", link: "/modules/rpc" },
              { text: "client", link: "/modules/client" },
              {
                text: "runtime",
                link: "/modules/runtime/",
                collapsed: false,
                items: [
                  { text: "개요", link: "/modules/runtime/" },
                  { text: "dispatch", link: "/modules/runtime/dispatch" },
                  { text: "factory", link: "/modules/runtime/factory" },
                  {
                    text: "socket-runtime",
                    link: "/modules/runtime/socket-runtime",
                  },
                  { text: "transport", link: "/modules/runtime/transport" },
                ],
              },
              {
                text: "react",
                link: "/modules/react/",
                collapsed: false,
                items: [
                  { text: "개요", link: "/modules/react/" },
                  { text: "hooks", link: "/modules/react/hooks" },
                  { text: "lib", link: "/modules/react/lib" },
                ],
              },
              { text: "stomp", link: "/modules/stomp" },
              {
                text: "workers",
                link: "/modules/workers/",
                collapsed: false,
                items: [
                  { text: "개요", link: "/modules/workers/" },
                  { text: "scripts", link: "/modules/workers/scripts" },
                ],
              },
            ],
          },
        ],
      },
      socialLinks: [],
      footer: {
        message: "@pungdung/worker-socket-bridge",
        copyright: "MIT",
      },
    },
  })
);
