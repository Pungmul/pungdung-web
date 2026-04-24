// DedicatedWorker 환경을 위한 필수 설정
self.exports = {};
importScripts(
  "https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"
);
importScripts(
  "https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.1.0/bundles/stomp.umd.min.js"
);

let stompClient = null;
let connectionPhase = "idle";
const subscriptions = new Map();
const pendingSubscriptions = [];
const pendingPublishes = [];
const pendingConnectCommands = [];

// DedicatedWorker 모드
self.addEventListener("message", (event) => {
  handleMessage(event.data);
});

function handleMessage(data) {
  const { type, data: messageData, commandId = null } = data;

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
      publishMessage(messageData, commandId);
      break;
    case "DISCONNECT":
      disconnectWebSocket();
      break;
  }
}

function connectWebSocket(config, commandId) {
  if (commandId) {
    pendingConnectCommands.push(commandId);
  }

  if (stompClient && stompClient.connected) {
    flushConnectAcks();
    emitConnectionState("connected", true);
    return;
  }

  if (connectionPhase === "connecting" || connectionPhase === "reconnecting") {
    emitConnectionState(connectionPhase, false);
    return;
  }

  connectionPhase = connectionPhase === "connected" ? "reconnecting" : "connecting";
  emitConnectionState(connectionPhase, false);

  const socket = new SockJS(config.url);

  stompClient = new self.StompJs.Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: config.headers?.Authorization,
    },
    onConnect: () => {
      connectionPhase = "connected";
      emitConnectionState("connected", true);
      flushConnectAcks();
      retryPendingSubscriptions();
      retryPendingPublishes();
    },
    onStompError: (error) => {
      connectionPhase = "failed";
      emitConnectionState("failed", false, String(error));
      rejectPendingConnect(error);
    },
    onWebSocketError: (error) => {
      connectionPhase = "failed";
      emitConnectionState("failed", false, String(error));
      rejectPendingConnect(error);
    },
    onWebSocketClose: () => {
      if (connectionPhase === "disconnected") {
        return;
      }
      connectionPhase = "reconnecting";
      emitConnectionState("reconnecting", false);
    },
  });

  stompClient.activate();
}

function subscribeToTopic(data, commandId) {
  const topic = data?.topic;
  if (!topic) {
    emitCommandError(commandId, "Topic is required for subscribe");
    return;
  }

  if (!stompClient || !stompClient.connected) {
    pendingSubscriptions.push({ topic, commandId });
    emitSubscriptionState(topic, "pending", commandId);
    emitRetrying("SUBSCRIBE", topic, commandId, "socket-not-connected");
    return;
  }

  if (subscriptions.has(topic)) {
    emitSubscribed(topic, commandId);
    return;
  }

  try {
    const subscription = stompClient.subscribe(topic, (message) => {
      const messageData = safeParseMessageBody(message.body);
      self.postMessage({
        type: "MESSAGE",
        data: {
          topic,
          message: messageData,
        },
      });
    });
    subscriptions.set(topic, subscription);
    emitSubscriptionState(topic, "pending", commandId);
    emitSubscribed(topic, commandId);
  } catch (error) {
    emitSubscriptionState(topic, "error", commandId, String(error));
    emitCommandError(commandId, error);
  }
}

function unsubscribeFromTopic(data) {
  const topic = data?.topic;
  if (!topic) {
    return;
  }

  if (subscriptions.has(topic)) {
    const subscription = subscriptions.get(topic);
    if (subscription && typeof subscription.unsubscribe === "function") {
      subscription.unsubscribe();
    }
    subscriptions.delete(topic);
  }
}

function publishMessage(data, commandId) {
  const topic = data?.topic;
  if (!topic) {
    emitCommandError(commandId, "Topic is required for publish");
    return;
  }

  if (!stompClient || !stompClient.connected) {
    pendingPublishes.push({ topic, message: data?.message, commandId });
    emitRetrying("SEND_MESSAGE", topic, commandId, "socket-not-connected");
    return;
  }

  try {
    stompClient.publish({
      destination: topic,
      body: JSON.stringify(data?.message ?? null),
      headers: undefined,
    });
    emitPublished(topic, commandId);
  } catch (error) {
    emitPublishState(topic, "error", commandId, String(error));
    emitCommandError(commandId, error);
  }
}

function disconnectWebSocket() {
  connectionPhase = "disconnected";
  emitConnectionState("disconnected", false);
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    subscriptions.clear();
    pendingSubscriptions.length = 0;
    pendingPublishes.length = 0;
  }
}

function retryPendingSubscriptions() {
  if (pendingSubscriptions.length === 0) {
    return;
  }

  const queued = pendingSubscriptions.splice(0, pendingSubscriptions.length);
  queued.forEach((queuedItem) => {
    subscribeToTopic({ topic: queuedItem.topic }, queuedItem.commandId);
  });
}

function retryPendingPublishes() {
  if (pendingPublishes.length === 0) {
    return;
  }

  const queued = pendingPublishes.splice(0, pendingPublishes.length);
  queued.forEach((queuedItem) => {
    publishMessage(
      { topic: queuedItem.topic, message: queuedItem.message },
      queuedItem.commandId
    );
  });
}

function flushConnectAcks() {
  if (pendingConnectCommands.length === 0) {
    return;
  }
  const commands = pendingConnectCommands.splice(0, pendingConnectCommands.length);
  commands.forEach((commandId) => {
    self.postMessage({
      type: "CONNECTED",
      commandId,
    });
  });
}

function rejectPendingConnect(error) {
  if (pendingConnectCommands.length === 0) {
    return;
  }
  const commands = pendingConnectCommands.splice(0, pendingConnectCommands.length);
  commands.forEach((commandId) => {
    emitCommandError(commandId, error);
  });
}

function emitConnectionState(phase, isConnected, error) {
  self.postMessage({
    type: "CONNECTION_STATE",
    data: {
      phase,
      isConnected,
      ...(error ? { error } : {}),
    },
  });
}

function emitSubscriptionState(topic, status, commandId, error) {
  self.postMessage({
    type: "SUBSCRIPTION_STATE",
    data: {
      topic,
      status,
      ...(error ? { error } : {}),
    },
    commandId: commandId || undefined,
  });
}

function emitPublishState(topic, status, commandId, error) {
  self.postMessage({
    type: "PUBLISHED",
    data: {
      topic,
      status,
      ...(error ? { error } : {}),
    },
    commandId: commandId || undefined,
  });
}

function emitSubscribed(topic, commandId) {
  self.postMessage({
    type: "SUBSCRIBED",
    data: { topic },
    commandId: commandId || undefined,
  });
  emitSubscriptionState(topic, "subscribed", commandId);
}

function emitPublished(topic, commandId) {
  emitPublishState(topic, "published", commandId);
}

function emitRetrying(commandType, topic, commandId, reason) {
  self.postMessage({
    type: "RETRYING",
    data: {
      commandType,
      ...(topic ? { topic } : {}),
      ...(reason ? { reason } : {}),
    },
    commandId: commandId || undefined,
  });
}

function emitCommandError(commandId, error) {
  self.postMessage({
    type: "ERROR",
    error: error instanceof Error ? error.message : String(error),
    commandId: commandId || undefined,
  });
}

function safeParseMessageBody(body) {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

