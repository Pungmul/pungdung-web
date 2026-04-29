---
layout: home

hero:
  name: worker-socket-bridge
  tagline: Worker 기반 STOMP 소켓 브리지 — RPC, Runtime Fallback, React 통합
  actions:
    - theme: brand
      text: 시작하기
      link: /guide/getting-started
    - theme: alt
      text: 아키텍처
      link: /guide/architecture

features:
  - title: Runtime Fallback
    details: SharedWorker → Dedicated Worker → Main Thread 순으로 자동 전환합니다.
  - title: RPC Bridge
    details: commandId 기반 Promise RPC와 fire-and-forget post command를 분리합니다.
  - title: React Ready
    details: Provider·hooks·foreground 복구 정책을 패키지에서 제공합니다.
  - title: STOMP in Worker
    details: STOMP 세션을 Worker에서 실행해 메인 스레드 부담을 줄입니다.
---
