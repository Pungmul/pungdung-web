// DedicatedWorker 환경을 위한 필수 설정
self.exports = {};
importScripts(
  "https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"
);
importScripts(
  "https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.1.0/bundles/stomp.umd.min.js"
);

let stompClient = null;
const subscriptions = new Map();
const pendingSubscriptions = []; // 대기 중인 구독들을 저장

// DedicatedWorker 모드
self.addEventListener("message", (event) => {
  handleMessage(event.data);
});

function handleMessage(data) {
  const { type, data: messageData, commandId = null } = data;

  console.log("[DedicatedWorker] 메시지 수신:", {
    type,
    commandId,
    data: messageData,
  });

  switch (type) {
    case "CONNECT":
      connectWebSocket(messageData, commandId);
      break;
    case "SUBSCRIBE":
      subscribeToTopic(messageData, commandId);
      break;
    case "UNSUBSCRIBE":
      unsubscribeFromTopic(messageData);
      break;
    case "SEND_MESSAGE":
      sendMessage(messageData);
      break;
    case "DISCONNECT":
      disconnectWebSocket();
      break;
  }
}

function connectWebSocket(config, commandId) {
  console.log("[DedicatedWorker] WebSocket 연결 시도:", {
    commandId,
    url: config.url,
  });

  if (stompClient && stompClient.connected) {
    self.postMessage({
      type: "CONNECTED",
      commandId,
    });
    return;
  }

  const socket = new SockJS(config.url);

  stompClient = new self.StompJs.Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: config.headers?.Authorization,
    },
    onConnect: () => {
      console.log("[DedicatedWorker] WebSocket 연결 성공:", { commandId });

      self.postMessage({
        type: "CONNECTED",
        commandId,
      });

      retryPendingSubscriptions();
    },
    onStompError: (error) => {
      console.error("[DedicatedWorker] STOMP 에러:", { error, commandId });

      self.postMessage({
        type: "ERROR",
        error: String(error),
        commandId,
      });
    },
    onWebSocketError: (error) => {
      console.error("[DedicatedWorker] WebSocket 에러:", { error, commandId });

      self.postMessage({
        type: "ERROR",
        error: String(error),
        commandId,
      });
    },
  });

  stompClient.activate();
}

function subscribeToTopic(data, commandId) {
  const { topic } = data;

  if (!stompClient || !stompClient.connected) {
    console.log("[DedicatedWorker] WebSocket 미연결, 구독 대기:", {
      topic,
      commandId,
    });
    // 대기 중인 구독으로 저장
    pendingSubscriptions.push({ ...data, commandId });
    return;
  }

  // 이미 구독 중인 토픽인지 확인
  if (subscriptions.has(topic)) {
    console.log("[DedicatedWorker] 이미 구독 중인 토픽:", { topic, commandId });
    return;
  } else {
    console.log("[DedicatedWorker] 새 토픽 구독:", { topic, commandId });
    // 새로운 토픽 구독
    subscriptions.set(topic, true);

    stompClient.subscribe(topic, (message) => {
      const messageData = JSON.parse(message.body);
      console.log("[DedicatedWorker] 토픽 메시지 수신:", {
        topic,
        messageData,
      });

      self.postMessage({
        type: "MESSAGE",
        data: {
          topic: topic,
          message: messageData,
        },
      });
    });

    // 구독 완료 알림
    self.postMessage({
      type: "SUBSCRIBED",
      data: {
        topic: topic,
      },
      commandId: commandId,
    });
    console.log("[DedicatedWorker] 구독 완료:", { topic, commandId });
  }
}

function unsubscribeFromTopic(data) {
  const { topic } = data;
  console.log("[DedicatedWorker] 토픽 구독 해제:", { topic });

  // 구독 제거
  if (subscriptions.has(topic)) {
    subscriptions.delete(topic);
    console.log("[DedicatedWorker] 구독 해제 완료:", { topic });
  }
}

function sendMessage(data) {
  if (!stompClient || !stompClient.connected) {
    console.warn("[DedicatedWorker] WebSocket 미연결, 메시지 전송 실패:", {
      data,
    });
    return;
  }

  const { topic, message } = data;
  console.log("[DedicatedWorker] 메시지 전송:", { topic, message });
  stompClient.publish({ destination: topic, body: JSON.stringify(message) });
}

function disconnectWebSocket() {
  console.log("[DedicatedWorker] WebSocket 연결 해제:");
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
    subscriptions.clear();
    pendingSubscriptions.length = 0;
  }
}

function retryPendingSubscriptions() {
  if (pendingSubscriptions.length > 0) {
    console.log("[DedicatedWorker] 대기 중인 구독 재시도:", {
      pendingCount: pendingSubscriptions.length,
    });

    pendingSubscriptions.forEach((data) => {
      const { commandId } = data;
      subscribeToTopic(data, commandId);
    });

    // 재시도 후 대기 목록 클리어
    pendingSubscriptions.length = 0;
    console.log("[DedicatedWorker] 대기 중인 구독 재시도 완료");
  }
}
