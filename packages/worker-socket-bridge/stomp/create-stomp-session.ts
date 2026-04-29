import { type StompSubscription } from "@stomp/stompjs";

import type {
  CommandEnvelope,
  ConnectionPhase,
  PongPayload,
  ResponseEnvelope,
  SocketConfig,
} from "../src/protocol";
import type {
  QueuedPublish,
  QueuedSubscription,
  TopicPayload,
} from "../workers/shared/worker-message-types";

import { buildStompConnectionProbe } from "./connection-probe";
import { SOCKET_NOT_CONNECTED_REASON } from "./constants";
import { formatWorkerError, safeParseMessageBody } from "./message-envelope-utils";
import { createStompLivenessTracker } from "./stomp-liveness";
import { createSessionResponseDispatch } from "./stomp-response-dispatch";
import { buildMessage } from "./stomp-response-emitters";
import {
  activateStompTransport,
  type StompTransportRefs,
} from "./stomp-transport";

export type StompSession = {
  handleCommand(envelope: CommandEnvelope): void;
  getConnectionProbe(): PongPayload;
  dispose(): void;
};

export function createStompSession(
  emit: (message: ResponseEnvelope) => void
): StompSession {
  let connectionPhase: ConnectionPhase = "idle";
  const transportRefs: StompTransportRefs = {
    stompClient: null,
    transportSocket: null,
  };
  const liveness = createStompLivenessTracker();
  const dispatch = createSessionResponseDispatch(emit);
  const subscriptions = new Map<string, StompSubscription>();
  const activeTopics = new Set<string>();
  const pendingSubscriptions: QueuedSubscription[] = [];
  const pendingPublishes: QueuedPublish[] = [];
  const pendingConnectCommands: string[] = [];

  const getStompClient = () => transportRefs.stompClient;

  const flushConnectAcks = () => {
    if (pendingConnectCommands.length === 0) {
      return;
    }
    const commands = pendingConnectCommands.splice(
      0,
      pendingConnectCommands.length
    );
    commands.forEach((commandId) => {
      dispatch.connected(commandId);
    });
  };

  const rejectPendingConnect = (error: unknown) => {
    if (pendingConnectCommands.length === 0) {
      return;
    }
    const commands = pendingConnectCommands.splice(
      0,
      pendingConnectCommands.length
    );
    commands.forEach((commandId) => {
      dispatch.commandError(commandId, error);
    });
  };

  const attachStompTopicSubscription = (topic: string): void => {
    const stompClient = getStompClient();
    if (!stompClient?.connected) {
      throw new Error("STOMP is not connected");
    }

    const subscription = stompClient.subscribe(topic, (message) => {
      liveness.touchServerActivity();
      emit(buildMessage(topic, safeParseMessageBody(message.body)));
    });
    subscriptions.set(topic, subscription);
    activeTopics.add(topic);
  };

  const resubscribeActiveTopics = () => {
    if (!getStompClient()?.connected || activeTopics.size === 0) {
      return;
    }

    subscriptions.clear();

    for (const topic of activeTopics) {
      try {
        attachStompTopicSubscription(topic);
      } catch (error) {
        subscriptions.delete(topic);
        dispatch.subscriptionState(
          topic,
          "error",
          null,
          formatWorkerError(error)
        );
      }
    }
  };

  const retryPendingSubscriptions = () => {
    if (pendingSubscriptions.length === 0) {
      return;
    }
    const queued = pendingSubscriptions.splice(0, pendingSubscriptions.length);
    queued.forEach((queuedItem) => {
      subscribeToTopic({ topic: queuedItem.topic }, queuedItem.commandId);
    });
  };

  const retryPendingPublishes = () => {
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
  };

  const connectWebSocket = (config: SocketConfig, commandId: string | null) => {
    if (commandId) {
      pendingConnectCommands.push(commandId);
    }

    if (getStompClient()?.connected) {
      flushConnectAcks();
      dispatch.connectionState("connected", true);
      return;
    }

    if (connectionPhase === "connecting" || connectionPhase === "reconnecting") {
      dispatch.connectionState(connectionPhase, false);
      return;
    }

    connectionPhase =
      connectionPhase === "connected" ? "reconnecting" : "connecting";
    dispatch.connectionState(connectionPhase, false);

    activateStompTransport(transportRefs, {
      config,
      liveness,
      getPhase: () => connectionPhase,
      setPhase: (phase) => {
        connectionPhase = phase;
      },
      notifyConnectionState: (phase, isConnected, error) => {
        dispatch.connectionState(phase, isConnected, error);
      },
      onConnected: () => {
        flushConnectAcks();
        resubscribeActiveTopics();
        retryPendingSubscriptions();
        retryPendingPublishes();
      },
      onWebSocketReconnecting: () => {
        subscriptions.clear();
      },
      rejectPendingConnect,
    });
  };

  function subscribeToTopic(data: TopicPayload, commandId: string | null): void {
    const topic = data?.topic;
    if (!topic) {
      dispatch.commandError(commandId, "Topic is required for subscribe");
      return;
    }

    const stompClient = getStompClient();
    if (!stompClient?.connected) {
      pendingSubscriptions.push({ topic, commandId });
      dispatch.subscriptionState(topic, "pending", commandId);
      dispatch.retrying(
        "SUBSCRIBE",
        topic,
        commandId,
        SOCKET_NOT_CONNECTED_REASON
      );
      return;
    }

    if (subscriptions.has(topic) && stompClient.connected) {
      dispatch.subscribed(topic, commandId);
      return;
    }

    try {
      attachStompTopicSubscription(topic);
      dispatch.subscriptionState(topic, "pending", commandId);
      dispatch.subscribed(topic, commandId);
    } catch (error) {
      dispatch.subscriptionState(
        topic,
        "error",
        commandId,
        formatWorkerError(error)
      );
      dispatch.commandError(commandId, error);
    }
  }

  function unsubscribeFromTopic(data: TopicPayload): void {
    const topic = data?.topic;
    if (!topic) {
      return;
    }

    const subscription = subscriptions.get(topic);
    if (subscription && typeof subscription.unsubscribe === "function") {
      subscription.unsubscribe();
    }
    subscriptions.delete(topic);
    activeTopics.delete(topic);
  }

  function publishMessage(data: TopicPayload, commandId: string | null): void {
    const topic = data?.topic;
    if (!topic) {
      dispatch.commandError(commandId, "Topic is required for publish");
      return;
    }

    const stompClient = getStompClient();
    if (!stompClient?.connected) {
      pendingPublishes.push({ topic, message: data?.message, commandId });
      dispatch.retrying(
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
      dispatch.published(topic, commandId);
    } catch (error) {
      dispatch.publishState(topic, "error", commandId, formatWorkerError(error));
      dispatch.commandError(commandId, error);
    }
  }

  function disconnectWebSocket(): void {
    connectionPhase = "disconnected";
    dispatch.connectionState("disconnected", false);
    if (transportRefs.stompClient) {
      transportRefs.stompClient.deactivate();
      transportRefs.stompClient = null;
      transportRefs.transportSocket = null;
      liveness.resetServerActivity();
      subscriptions.clear();
      activeTopics.clear();
      pendingSubscriptions.length = 0;
      pendingPublishes.length = 0;
    }
  }

  return {
    getConnectionProbe: (): PongPayload =>
      buildStompConnectionProbe(
        transportRefs.stompClient,
        connectionPhase,
        transportRefs.transportSocket,
        liveness
      ),

    handleCommand(envelope: CommandEnvelope) {
      const { type, data, commandId = null } = envelope;

      switch (type) {
        case "CONNECT":
          connectWebSocket(data as SocketConfig, commandId ?? null);
          break;
        case "SUBSCRIBE":
          subscribeToTopic(data as TopicPayload, commandId ?? null);
          break;
        case "UNSUBSCRIBE":
          unsubscribeFromTopic(data as TopicPayload);
          break;
        case "SEND_MESSAGE":
          publishMessage(data as TopicPayload, commandId ?? null);
          break;
        case "DISCONNECT":
          disconnectWebSocket();
          break;
      }
    },

    dispose() {
      disconnectWebSocket();
      pendingConnectCommands.length = 0;
    },
  };
}
