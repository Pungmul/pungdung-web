import { SocketManager } from "../src/client/socket-manager";

// 실제 브라우저에서 테스트 코드를 호출하기 위해 window에 테스트용 메서드 추가
declare global {
  interface Window {
    socketBridgeE2e: {
      connectAndSubscribe(socketUrl: string): Promise<"shared" | "dedicated" | "main-thread" | null>;
      getReceivedMessages(): unknown[];
      disconnect(): Promise<void>;
    };
  }
}

let manager: SocketManager | null = null;
const receivedMessages: unknown[] = [];

window.socketBridgeE2e = {
  async connectAndSubscribe(socketUrl) {
    manager = new SocketManager({
      commandTimeoutMs: 3_000,
      idleDisconnectMs: 0,
    });

    await manager.connect({
      url: socketUrl,
      stomp: {
        connectionTimeout: 3_000,
        reconnectDelay: 0,
      },
    });
    await manager.subscribe("/topic/e2e", (message) => {
      receivedMessages.push(message);
    });

    return manager.getRuntimeMode();
  },

  getReceivedMessages() {
    return receivedMessages;
  },

  async disconnect() {
    await manager?.disconnect();
    manager = null;
  },
};
