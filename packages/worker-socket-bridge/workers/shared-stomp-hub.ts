import { type StompSubscription } from "@stomp/stompjs";

import { buildStompConnectionProbe } from "../stomp/connection-probe";
import { SOCKET_NOT_CONNECTED_REASON } from "../stomp/constants";
import { formatWorkerError, safeParseMessageBody } from "../stomp/message-envelope-utils";
import { createStompLivenessTracker } from "../stomp/stomp-liveness";
import { createHubClientResponseDispatch } from "../stomp/stomp-response-dispatch";
import { buildMessage, buildPong } from "../stomp/stomp-response-emitters";
import {
  activateStompTransport,
  type StompTransportRefs,
} from "../stomp/stomp-transport";

import type {
  ConnectionPhase,
  QueuedPublish,
  QueuedSubscription,
  SocketConfig,
  TopicPayload,
  TopicSubscribeWaiter,
  TopicSubscriptionState,
  WorkerMessage,
  WorkerOutboundMessage,
} from "./shared/worker-message-types";

type ClientId = number;

export type SharedStompHub = {
  connectClient(port: MessagePort): ClientId;
  handleMessage(data: WorkerMessage, clientId: ClientId): void;
  disconnectClient(clientId: ClientId): void;
};

export function createSharedStompHub(): SharedStompHub {
  let connectionPhase: ConnectionPhase = "idle";
  const transportRefs: StompTransportRefs = {
    stompClient: null,
    transportSocket: null,
  };
  const liveness = createStompLivenessTracker();

  const connections = new Map<ClientId, MessagePort>();
  const topicSubscribers = new Map<string, Set<ClientId>>();
  const topicSubscriptions = new Map<string, StompSubscription>();
  const topicSubscriptionStates = new Map<string, TopicSubscriptionState>();
  const pendingTopicSubscribeAcks = new Map<string, TopicSubscribeWaiter[]>();
  const pendingSubscriptions = new Map<ClientId, QueuedSubscription[]>();
  const pendingPublishes = new Map<ClientId, QueuedPublish[]>();
  const pendingConnectCommands = new Map<ClientId, string[]>();

  const getStompClient = () => transportRefs.stompClient;

  function sendToClient(clientId: ClientId, message: WorkerOutboundMessage): void {
    const port = connections.get(clientId);
    if (port) {
      port.postMessage(message);
    }
  }

  const clientDispatch = createHubClientResponseDispatch(sendToClient);

  function broadcastConnectionState(
    phase: ConnectionPhase,
    isConnected: boolean,
    error?: string
  ): void {
    connections.forEach((_port, clientId) => {
      clientDispatch.connectionState(clientId, phase, isConnected, error);
    });
  }

  function enqueueConnectCommand(
    clientId: ClientId,
    commandId: string | null
  ): void {
    if (!commandId) {
      return;
    }
    const commands = pendingConnectCommands.get(clientId) ?? [];
    commands.push(commandId);
    pendingConnectCommands.set(clientId, commands);
  }

  function flushConnectAcks(clientId: ClientId): void {
    const commandIds = pendingConnectCommands.get(clientId) ?? [];
    commandIds.forEach((commandId) => {
      clientDispatch.connected(clientId, commandId);
    });
    pendingConnectCommands.delete(clientId);
  }

  function flushAllConnectAcks(): void {
    pendingConnectCommands.forEach((_commandIds, clientId) => {
      flushConnectAcks(clientId);
    });
  }

  function rejectPendingConnect(error: unknown): void {
    pendingConnectCommands.forEach((commandIds, clientId) => {
      commandIds.forEach((commandId) => {
        clientDispatch.commandError(clientId, commandId, error);
      });
    });
    pendingConnectCommands.clear();
  }

  function attachStompTopicSubscription(topic: string): void {
    const stompClient = getStompClient();
    if (!stompClient?.connected) {
      throw new Error("STOMP is not connected");
    }

    const subscription = stompClient.subscribe(
      topic,
      (message) => {
        liveness.touchServerActivity();
        const messageData = safeParseMessageBody(message.body);
        const subscribersForTopic = topicSubscribers.get(topic);
        if (!subscribersForTopic) {
          return;
        }
        subscribersForTopic.forEach((subscriberId) => {
          sendToClient(subscriberId, buildMessage(topic, messageData));
        });
      },
      undefined
    );
    topicSubscriptions.set(topic, subscription);
    topicSubscriptionStates.set(topic, { status: "subscribed" });
  }

  function resubscribeActiveTopics(): void {
    if (!getStompClient()?.connected || topicSubscribers.size === 0) {
      return;
    }

    topicSubscriptions.clear();

    for (const topic of topicSubscribers.keys()) {
      try {
        attachStompTopicSubscription(topic);
      } catch (error) {
        const message = formatWorkerError(error);
        topicSubscriptionStates.set(topic, { status: "error", error: message });
        const subscribersForTopic = topicSubscribers.get(topic);
        subscribersForTopic?.forEach((subscriberId) => {
          clientDispatch.subscriptionState(
            subscriberId,
            topic,
            "error",
            null,
            message
          );
        });
      }
    }
  }

  function retryPendingSubscriptions(): void {
    pendingSubscriptions.forEach((queuedSubscriptions, clientId) => {
      queuedSubscriptions.forEach((queuedItem) => {
        subscribeToTopic({ topic: queuedItem.topic }, clientId, queuedItem.commandId);
      });
    });
    pendingSubscriptions.clear();
  }

  function retryPendingPublishes(): void {
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

  function connectWebSocket(
    config: SocketConfig,
    clientId: ClientId,
    commandId: string | null
  ): void {
    enqueueConnectCommand(clientId, commandId);

    if (getStompClient()?.connected && connectionPhase === "connected") {
      clientDispatch.connectionState(clientId, "connected", true);
      flushConnectAcks(clientId);
      return;
    }

    if (connectionPhase === "connecting" || connectionPhase === "reconnecting") {
      clientDispatch.connectionState(clientId, connectionPhase, false);
      return;
    }

    connectionPhase =
      connectionPhase === "connected" ? "reconnecting" : "connecting";
    broadcastConnectionState(connectionPhase, false);

    activateStompTransport(transportRefs, {
      config,
      liveness,
      getPhase: () => connectionPhase,
      setPhase: (phase) => {
        connectionPhase = phase;
      },
      notifyConnectionState: broadcastConnectionState,
      onConnected: () => {
        flushAllConnectAcks();
        resubscribeActiveTopics();
        retryPendingSubscriptions();
        retryPendingPublishes();
      },
      onWebSocketReconnecting: () => {
        topicSubscriptions.clear();
        topicSubscribers.forEach((_subscribers, topic) => {
          if (topicSubscriptionStates.get(topic)?.status === "subscribed") {
            topicSubscriptionStates.set(topic, { status: "pending" });
          }
        });
      },
      rejectPendingConnect,
    });
  }

  function subscribeToTopic(
    data: TopicPayload,
    clientId: ClientId,
    commandId: string | null
  ): void {
    const topic = data?.topic;
    if (!topic) {
      clientDispatch.commandError(
        clientId,
        commandId,
        "Topic is required for subscribe"
      );
      return;
    }

    if (!getStompClient()?.connected) {
      const queued = pendingSubscriptions.get(clientId) ?? [];
      queued.push({ topic, commandId });
      pendingSubscriptions.set(clientId, queued);
      clientDispatch.subscriptionState(clientId, topic, "pending", commandId);
      clientDispatch.retrying(
        clientId,
        "SUBSCRIBE",
        topic,
        commandId,
        SOCKET_NOT_CONNECTED_REASON
      );
      return;
    }

    let subscribers = topicSubscribers.get(topic);
    if (!subscribers) {
      subscribers = new Set();
      topicSubscribers.set(topic, subscribers);
    }
    subscribers.add(clientId);

    const topicState = topicSubscriptionStates.get(topic);
    if (
      topicState?.status === "subscribed" &&
      topicSubscriptions.has(topic) &&
      getStompClient()?.connected
    ) {
      clientDispatch.subscribed(clientId, topic, commandId);
      return;
    }

    if (topicState?.status === "pending") {
      enqueueTopicSubscribeAck(topic, clientId, commandId);
      clientDispatch.subscriptionState(clientId, topic, "pending", commandId);
      return;
    }

    topicSubscriptionStates.set(topic, { status: "pending" });
    enqueueTopicSubscribeAck(topic, clientId, commandId);
    clientDispatch.subscriptionState(clientId, topic, "pending", commandId);

    try {
      attachStompTopicSubscription(topic);
      flushTopicSubscribeAcks(topic);
    } catch (error) {
      const message = formatWorkerError(error);
      topicSubscriptionStates.set(topic, { status: "error", error: message });
      rejectTopicSubscribeAcks(topic, message);
    }
  }

  function unsubscribeFromTopic(data: TopicPayload, clientId: ClientId): void {
    const topic = data?.topic;
    if (!topic) {
      return;
    }

    const subscribers = topicSubscribers.get(topic);
    if (!subscribers) {
      return;
    }

    subscribers.delete(clientId);
    removeTopicSubscribeAck(topic, clientId);

    if (subscribers.size === 0) {
      topicSubscribers.delete(topic);
      const stompSubscription = topicSubscriptions.get(topic);
      if (
        stompSubscription &&
        typeof stompSubscription.unsubscribe === "function"
      ) {
        stompSubscription.unsubscribe();
      }
      topicSubscriptions.delete(topic);
      topicSubscriptionStates.delete(topic);
      pendingTopicSubscribeAcks.delete(topic);
    }
  }

  function publishMessage(
    data: TopicPayload,
    clientId: ClientId,
    commandId: string | null
  ): void {
    const topic = data?.topic;
    if (!topic) {
      clientDispatch.commandError(
        clientId,
        commandId,
        "Topic is required for publish"
      );
      return;
    }

    const stompClient = getStompClient();
    if (!stompClient?.connected) {
      const queued = pendingPublishes.get(clientId) ?? [];
      queued.push({
        topic,
        message: data?.message,
        commandId,
      });
      pendingPublishes.set(clientId, queued);
      clientDispatch.retrying(
        clientId,
        "SEND_MESSAGE",
        topic,
        commandId,
        SOCKET_NOT_CONNECTED_REASON
      );
      return;
    }

    try {
      stompClient.publish({
        destination: topic,
        body: JSON.stringify(data?.message ?? null),
      });
      clientDispatch.published(clientId, topic, commandId);
    } catch (error) {
      clientDispatch.publishState(
        clientId,
        topic,
        "error",
        commandId,
        formatWorkerError(error)
      );
      clientDispatch.commandError(clientId, commandId, error);
    }
  }

  function disconnectClient(clientId: ClientId): void {
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

    if (connections.size === 0 && transportRefs.stompClient) {
      connectionPhase = "disconnected";
      transportRefs.stompClient.deactivate();
      transportRefs.stompClient = null;
      transportRefs.transportSocket = null;
      liveness.resetServerActivity();
      topicSubscribers.clear();
      topicSubscriptions.clear();
      topicSubscriptionStates.clear();
      pendingTopicSubscribeAcks.clear();
      pendingSubscriptions.clear();
      pendingPublishes.clear();
    }
  }

  function enqueueTopicSubscribeAck(
    topic: string,
    clientId: ClientId,
    commandId: string | null
  ): void {
    const waiters = pendingTopicSubscribeAcks.get(topic) ?? [];
    waiters.push({ clientId, commandId });
    pendingTopicSubscribeAcks.set(topic, waiters);
  }

  function flushTopicSubscribeAcks(topic: string): void {
    const waiters = pendingTopicSubscribeAcks.get(topic) ?? [];
    if (waiters.length === 0) {
      return;
    }
    waiters.forEach((waiter) => {
      clientDispatch.subscribed(waiter.clientId, topic, waiter.commandId);
    });
    pendingTopicSubscribeAcks.delete(topic);
  }

  function rejectTopicSubscribeAcks(topic: string, error: string): void {
    const waiters = pendingTopicSubscribeAcks.get(topic) ?? [];
    waiters.forEach((waiter) => {
      clientDispatch.subscriptionState(
        waiter.clientId,
        topic,
        "error",
        waiter.commandId,
        error
      );
      if (waiter.commandId) {
        clientDispatch.commandError(waiter.clientId, waiter.commandId, error);
      }
    });
    pendingTopicSubscribeAcks.delete(topic);
  }

  function removeTopicSubscribeAck(topic: string, clientId: ClientId): void {
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

  function connectClient(port: MessagePort): ClientId {
    const clientId = Date.now() + Math.random();
    connections.set(clientId, port);
    port.addEventListener("message", (messageEvent: MessageEvent<WorkerMessage>) => {
      handleMessage(messageEvent.data, clientId);
    });
    port.start();
    return clientId;
  }

  function handleMessage(data: WorkerMessage, clientId: ClientId): void {
    const { type, data: messageData, commandId = null } = data;

    switch (type) {
      case "PING":
        sendToClient(clientId, {
          ...buildPong(
            buildStompConnectionProbe(
              transportRefs.stompClient,
              connectionPhase,
              transportRefs.transportSocket,
              liveness
            ),
            commandId ?? null
          ),
          clientId,
        });
        break;
      case "CONNECT":
        connectWebSocket(messageData as SocketConfig, clientId, commandId ?? null);
        break;
      case "SUBSCRIBE":
        subscribeToTopic(messageData as TopicPayload, clientId, commandId ?? null);
        break;
      case "UNSUBSCRIBE":
        unsubscribeFromTopic(messageData as TopicPayload, clientId);
        break;
      case "SEND_MESSAGE":
        publishMessage(messageData as TopicPayload, clientId, commandId ?? null);
        break;
      case "DISCONNECT":
        disconnectClient(clientId);
        break;
    }
  }

  return {
    connectClient,
    handleMessage,
    disconnectClient,
  };
}
