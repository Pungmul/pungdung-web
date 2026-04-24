// SharedWorker 환경을 위한 필수 설정
self.exports = {};

importScripts(
  "https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"
);
importScripts(
  "https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.1.0/bundles/stomp.umd.min.js"
);

let stompClient = null;
let connectionPhase = "idle";
const connections = new Map();
const topicSubscribers = new Map();
const topicSubscriptions = new Map();
const topicSubscriptionStates = new Map();
const pendingTopicSubscribeAcks = new Map();
const pendingSubscriptions = new Map();
const pendingPublishes = new Map();
const pendingConnectCommands = new Map();

// SharedWorker 모드
self.addEventListener("connect", (event) => {
  const port = event.ports[0];
  const clientId = Date.now() + Math.random();
  connections.set(clientId, port);

  port.addEventListener("message", (event) => {
    handleMessage(event.data, clientId);
  });

  port.start(); // 반드시 호출
});

function handleMessage(data, clientId) {
  const { type, data: messageData, commandId = null } = data;

  switch (type) {
    case "CONNECT":
      connectWebSocket(messageData, clientId, commandId);
      break;
    case "SUBSCRIBE":
      subscribeToTopic(messageData, clientId, commandId);
      break;
    case "UNSUBSCRIBE":
      unsubscribeFromTopic(messageData, clientId);
      break;
    case "SEND_MESSAGE":
      publishMessage(messageData, clientId, commandId);
      break;
    case "DISCONNECT":
      disconnectClient(clientId);
      break;
  }
}

function connectWebSocket(config, clientId, commandId) {
  enqueueConnectCommand(clientId, commandId);

  if (stompClient && stompClient.connected && connectionPhase === "connected") {
    sendConnectionStateToClient(clientId, "connected", true);
    flushConnectAcks(clientId);
    return;
  }

  if (connectionPhase === "connecting" || connectionPhase === "reconnecting") {
    sendConnectionStateToClient(clientId, connectionPhase, false);
    return;
  }

  connectionPhase = connectionPhase === "connected" ? "reconnecting" : "connecting";
  broadcastConnectionState(connectionPhase, false);

  const socket = new SockJS(config.url);
  stompClient = new self.StompJs.Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: config.headers?.Authorization,
    },
    onConnect: () => {
      connectionPhase = "connected";
      broadcastConnectionState("connected", true);
      flushAllConnectAcks();
      retryPendingSubscriptions();
      retryPendingPublishes();
    },
    onWebSocketClose: () => {
      if (connectionPhase === "disconnected") {
        return;
      }
      connectionPhase = "reconnecting";
      broadcastConnectionState("reconnecting", false);
    },
    onStompError: (error) => {
      connectionPhase = "failed";
      broadcastConnectionState("failed", false, String(error));
      rejectPendingConnect(error);
    },
  });
  stompClient.activate();
}

function subscribeToTopic(data, clientId, commandId) {
  const topic = data?.topic;
  if (!topic) {
    sendCommandError(clientId, commandId, "Topic is required for subscribe");
    return;
  }

  if (!stompClient || !stompClient.connected) {
    if (!pendingSubscriptions.has(clientId)) {
      pendingSubscriptions.set(clientId, []);
    }
    pendingSubscriptions.get(clientId).push({ topic, commandId });
    sendSubscriptionState(clientId, topic, "pending", commandId);
    sendRetrying(clientId, "SUBSCRIBE", topic, commandId, "socket-not-connected");
    return;
  }

  let subscribers = topicSubscribers.get(topic);
  if (!subscribers) {
    subscribers = new Set();
    topicSubscribers.set(topic, subscribers);
  }
  subscribers.add(clientId);

  const topicState = topicSubscriptionStates.get(topic);
  if (topicState?.status === "subscribed") {
    sendSubscribed(clientId, topic, commandId);
    return;
  }

  if (topicState?.status === "pending") {
    enqueueTopicSubscribeAck(topic, clientId, commandId);
    sendSubscriptionState(clientId, topic, "pending", commandId);
    return;
  }

  topicSubscriptionStates.set(topic, { status: "pending" });
  enqueueTopicSubscribeAck(topic, clientId, commandId);
  sendSubscriptionState(clientId, topic, "pending", commandId);

  try {
    const subscription = stompClient.subscribe(
      topic,
      (message) => {
        const messageData = safeParseMessageBody(message.body);
        const subscribersForTopic = topicSubscribers.get(topic);
        if (!subscribersForTopic) {
          return;
        }
        subscribersForTopic.forEach((subscriberId) => {
          sendToClient(subscriberId, {
            type: "MESSAGE",
            data: {
              topic,
              message: messageData,
            },
          });
        });
      },
      undefined
    );
    topicSubscriptions.set(topic, subscription);
    topicSubscriptionStates.set(topic, { status: "subscribed" });
    flushTopicSubscribeAcks(topic);
  } catch (error) {
    const subscribersForTopic = topicSubscribers.get(topic);
    if (subscribersForTopic && subscribersForTopic.size === 0) {
      topicSubscribers.delete(topic);
    }
    const message = String(error);
    topicSubscriptionStates.set(topic, { status: "error", error: message });
    rejectTopicSubscribeAcks(topic, message);
  }
}

function unsubscribeFromTopic(data, clientId) {
  const topic = data?.topic;
  if (!topic) {
    return;
  }

  if (topicSubscribers.has(topic)) {
    const subscribers = topicSubscribers.get(topic);
    subscribers.delete(clientId);
    removeTopicSubscribeAck(topic, clientId);

    if (subscribers.size === 0) {
      topicSubscribers.delete(topic);
      const stompSubscription = topicSubscriptions.get(topic);
      if (stompSubscription && typeof stompSubscription.unsubscribe === "function") {
        stompSubscription.unsubscribe();
      }
      topicSubscriptions.delete(topic);
      topicSubscriptionStates.delete(topic);
      pendingTopicSubscribeAcks.delete(topic);
    }
  }
}

function publishMessage(data, clientId, commandId) {
  const topic = data?.topic;
  if (!topic) {
    sendCommandError(clientId, commandId, "Topic is required for publish");
    return;
  }

  if (!stompClient || !stompClient.connected) {
    if (!pendingPublishes.has(clientId)) {
      pendingPublishes.set(clientId, []);
    }
    pendingPublishes.get(clientId).push({
      topic,
      message: data?.message,
      commandId,
    });
    sendRetrying(clientId, "SEND_MESSAGE", topic, commandId, "socket-not-connected");
    return;
  }

  try {
    stompClient.publish({
      destination: topic,
      body: JSON.stringify(data?.message ?? null),
      headers: undefined,
    });
    sendPublished(clientId, topic, commandId);
  } catch (error) {
    sendToClient(clientId, {
      type: "PUBLISHED",
      data: {
        topic,
        status: "error",
        error: String(error),
      },
      commandId: commandId || undefined,
    });
    sendCommandError(clientId, commandId, error);
  }
}

function disconnectClient(clientId) {
  topicSubscribers.forEach((subscribers, topic) => {
    subscribers.delete(clientId);
    removeTopicSubscribeAck(topic, clientId);
    if (subscribers.size === 0) {
      topicSubscribers.delete(topic);
      const subscription = topicSubscriptions.get(topic);
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
      topicSubscriptions.delete(topic);
      topicSubscriptionStates.delete(topic);
      pendingTopicSubscribeAcks.delete(topic);
    }
  });

  pendingSubscriptions.delete(clientId);
  pendingPublishes.delete(clientId);
  pendingConnectCommands.delete(clientId);
  connections.delete(clientId);

  if (connections.size === 0 && stompClient) {
    connectionPhase = "disconnected";
    stompClient.deactivate();
    stompClient = null;
    topicSubscribers.clear();
    topicSubscriptions.clear();
    topicSubscriptionStates.clear();
    pendingTopicSubscribeAcks.clear();
    pendingSubscriptions.clear();
    pendingPublishes.clear();
  }
}

/**
 *
 * @param {string} clientId
 * @param {{type: "MESSAGE"|"IMAGE", data: {topic: string, message: object}}} message
 */
function sendToClient(clientId, message) {
  const port = connections.get(clientId);
  if (port) {
    port.postMessage(message);
  }
}

function retryPendingSubscriptions() {
  pendingSubscriptions.forEach((queuedSubscriptions, clientId) => {
    queuedSubscriptions.forEach((queuedItem) => {
      subscribeToTopic({ topic: queuedItem.topic }, clientId, queuedItem.commandId);
    });
  });
  pendingSubscriptions.clear();
}

function retryPendingPublishes() {
  pendingPublishes.forEach((queuedPublishes, clientId) => {
    queuedPublishes.forEach((queuedItem) => {
      publishMessage(
        { topic: queuedItem.topic, message: queuedItem.message },
        clientId,
        queuedItem.commandId
      );
    });
  });
  pendingPublishes.clear();
}

function enqueueConnectCommand(clientId, commandId) {
  if (!commandId) {
    return;
  }
  if (!pendingConnectCommands.has(clientId)) {
    pendingConnectCommands.set(clientId, []);
  }
  pendingConnectCommands.get(clientId).push(commandId);
}

function flushConnectAcks(clientId) {
  const commandIds = pendingConnectCommands.get(clientId) || [];
  commandIds.forEach((commandId) => {
    sendToClient(clientId, {
      type: "CONNECTED",
      clientId,
      commandId,
    });
  });
  pendingConnectCommands.delete(clientId);
}

function flushAllConnectAcks() {
  pendingConnectCommands.forEach((_, clientId) => {
    flushConnectAcks(clientId);
  });
}

function rejectPendingConnect(error) {
  pendingConnectCommands.forEach((commandIds, clientId) => {
    commandIds.forEach((commandId) => {
      sendCommandError(clientId, commandId, error);
    });
  });
  pendingConnectCommands.clear();
}

function sendConnectionStateToClient(clientId, phase, isConnected, error) {
  sendToClient(clientId, {
    type: "CONNECTION_STATE",
    data: {
      phase,
      isConnected,
      ...(error ? { error } : {}),
    },
  });
}

function broadcastConnectionState(phase, isConnected, error) {
  connections.forEach((_port, clientId) => {
    sendConnectionStateToClient(clientId, phase, isConnected, error);
  });
}

function sendSubscriptionState(clientId, topic, status, commandId, error) {
  sendToClient(clientId, {
    type: "SUBSCRIPTION_STATE",
    data: {
      topic,
      status,
      ...(error ? { error } : {}),
    },
    commandId: commandId || undefined,
  });
}

function sendSubscribed(clientId, topic, commandId) {
  sendToClient(clientId, {
    type: "SUBSCRIBED",
    data: { topic },
    commandId: commandId || undefined,
  });
  sendSubscriptionState(clientId, topic, "subscribed", commandId);
}

function sendPublished(clientId, topic, commandId) {
  sendToClient(clientId, {
    type: "PUBLISHED",
    data: {
      topic,
      status: "published",
    },
    commandId: commandId || undefined,
  });
}

function sendRetrying(clientId, commandType, topic, commandId, reason) {
  sendToClient(clientId, {
    type: "RETRYING",
    data: {
      commandType,
      ...(topic ? { topic } : {}),
      ...(reason ? { reason } : {}),
    },
    commandId: commandId || undefined,
  });
}

function sendCommandError(clientId, commandId, error) {
  sendToClient(clientId, {
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

function enqueueTopicSubscribeAck(topic, clientId, commandId) {
  if (!pendingTopicSubscribeAcks.has(topic)) {
    pendingTopicSubscribeAcks.set(topic, []);
  }
  pendingTopicSubscribeAcks.get(topic).push({ clientId, commandId });
}

function flushTopicSubscribeAcks(topic) {
  const waiters = pendingTopicSubscribeAcks.get(topic) || [];
  if (waiters.length === 0) {
    return;
  }
  waiters.forEach((waiter) => {
    sendSubscribed(waiter.clientId, topic, waiter.commandId);
  });
  pendingTopicSubscribeAcks.delete(topic);
}

function rejectTopicSubscribeAcks(topic, error) {
  const waiters = pendingTopicSubscribeAcks.get(topic) || [];
  waiters.forEach((waiter) => {
    sendSubscriptionState(waiter.clientId, topic, "error", waiter.commandId, error);
    if (waiter.commandId) {
      sendCommandError(waiter.clientId, waiter.commandId, error);
    }
  });
  pendingTopicSubscribeAcks.delete(topic);
}

function removeTopicSubscribeAck(topic, clientId) {
  const waiters = pendingTopicSubscribeAcks.get(topic);
  if (!waiters || waiters.length === 0) {
    return;
  }
  const remaining = waiters.filter((waiter) => waiter.clientId !== clientId);
  if (remaining.length === 0) {
    pendingTopicSubscribeAcks.delete(topic);
    return;
  }
  pendingTopicSubscribeAcks.set(topic, remaining);
}
