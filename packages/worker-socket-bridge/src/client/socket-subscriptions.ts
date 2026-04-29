import type { MessagePayload, SocketListener, SubscriptionStatus } from "../protocol";

import type { TopicReadinessEntry } from "./socket-snapshot";
import { TopicBuffer } from "./topic-buffer";

export class SocketSubscriptions {
  private readonly listenersByTopic = new Map<string, Array<(data: unknown) => void>>();
  private readonly subscribedTopics = new Set<string>();
  private readonly pendingTopics = new Set<string>();
  private readonly topicErrors = new Map<string, string>();

  constructor(
    private readonly deps: {
      topicBuffer: TopicBuffer;
      hasRuntime: () => boolean;
      invokeSubscribe: (topic: string) => Promise<void>;
      postUnsubscribe: (topic: string) => void;
      onStateChanged: () => void;
      touchInboundMessageActivity: () => void;
    }
  ) {}

  addListener(topic: string, callback: (data: unknown) => void): boolean {
    let listeners = this.listenersByTopic.get(topic);
    if (!listeners) {
      listeners = [];
      this.listenersByTopic.set(topic, listeners);
    }
    listeners.push(callback);
    return listeners.length === 1;
  }

  removeListener(topic: string, callback: (data: unknown) => void): boolean {
    const listeners = this.listenersByTopic.get(topic);
    if (!listeners) {
      return false;
    }

    const index = listeners.indexOf(callback);
    if (index === -1) {
      return false;
    }

    listeners.splice(index, 1);
    if (listeners.length > 0) {
      return false;
    }

    this.listenersByTopic.delete(topic);
    this.scheduleUnsubscribe(topic);
    return true;
  }

  getTopicListenerCount(topic: string): number {
    return this.listenersByTopic.get(topic)?.length ?? 0;
  }

  getListenerTopicSize(): number {
    return this.listenersByTopic.size;
  }

  getActiveTopics(): string[] {
    return [...this.listenersByTopic.keys()].filter(
      (topic) => this.getTopicListenerCount(topic) > 0
    );
  }

  isTopicSubscribed(topic: string): boolean {
    return this.subscribedTopics.has(topic);
  }

  async subscribe(
    topic: string,
    callback: (data: unknown) => void
  ): Promise<SocketListener> {
    const isFirstOnTopic = this.addListener(topic, callback);

    if (isFirstOnTopic) {
      const resumedWorkerSubscription =
        this.deps.topicBuffer.cancel(topic) || this.subscribedTopics.has(topic);

      if (resumedWorkerSubscription) {
        this.flushMessageBuffer(topic);
        return this.createSocketListener(topic, callback);
      }

      this.markTopicPending(topic);
      this.deps.onStateChanged();

      if (this.deps.hasRuntime()) {
        try {
          await this.deps.invokeSubscribe(topic);
          this.flushMessageBuffer(topic);
        } catch (subscribeError) {
          this.removeListener(topic, callback);
          throw subscribeError;
        }
      } else {
        this.removeListener(topic, callback);
        throw new Error("Socket runtime is not initialized");
      }
    }

    return this.createSocketListener(topic, callback);
  }

  flushMessageBuffer(topic: string): void {
    this.deps.topicBuffer.flush(topic, (message) => {
      this.deliverMessage(topic, message);
    });
  }

  deliverMessage(topic: string, message: unknown): void {
    this.deps.touchInboundMessageActivity();

    const listeners = this.listenersByTopic.get(topic);
    if (!listeners || listeners.length === 0) {
      return;
    }

    for (const callback of listeners) {
      try {
        callback(message);
      } catch (callbackError) {
        console.error("Socket subscription callback error", callbackError);
      }
    }
  }

  dispatchMessage(payload: MessagePayload): void {
    if (this.getTopicListenerCount(payload.topic) === 0) {
      if (
        this.deps.topicBuffer.canRetain(payload.topic, {
          workerSubscribed: this.subscribedTopics.has(payload.topic),
        })
      ) {
        this.deps.topicBuffer.append(payload.topic, payload.message);
      }
      return;
    }

    this.deliverMessage(payload.topic, payload.message);
  }

  markTopicSubscribed(topic: string): void {
    this.subscribedTopics.add(topic);
    this.pendingTopics.delete(topic);
    this.topicErrors.delete(topic);
  }

  markTopicPending(topic: string): void {
    this.pendingTopics.add(topic);
    this.subscribedTopics.delete(topic);
    this.topicErrors.delete(topic);
  }

  markTopicError(topic: string, error: string): void {
    this.subscribedTopics.delete(topic);
    this.pendingTopics.delete(topic);
    this.topicErrors.set(topic, error);
  }

  private resolveTopicStatus(topic: string): SubscriptionStatus {
    if (this.topicErrors.has(topic)) {
      return "error";
    }
    if (this.subscribedTopics.has(topic)) {
      return "subscribed";
    }
    if (this.pendingTopics.has(topic) || this.getTopicListenerCount(topic) > 0) {
      return "pending";
    }
    return "idle";
  }

  getTopicStatus(topic: string): SubscriptionStatus {
    return this.resolveTopicStatus(topic);
  }

  getTopicError(topic: string): string | undefined {
    return this.topicErrors.get(topic);
  }

  buildTopicReadinessMap(): Map<string, TopicReadinessEntry> {
    const readiness = new Map<string, TopicReadinessEntry>();

    for (const topic of this.subscribedTopics) {
      readiness.set(topic, { status: "subscribed" });
    }

    for (const topic of this.pendingTopics) {
      if (!readiness.has(topic)) {
        readiness.set(topic, { status: "pending" });
      }
    }

    for (const [topic, error] of this.topicErrors) {
      readiness.set(topic, { status: "error", error });
    }

    for (const topic of this.listenersByTopic.keys()) {
      if (!readiness.has(topic)) {
        readiness.set(topic, { status: "pending" });
      }
    }

    return readiness;
  }

  async resyncTopics(topics: readonly string[]): Promise<void> {
    const activeTopics = topics.filter(
      (topic) => this.getTopicListenerCount(topic) > 0
    );

    if (activeTopics.length === 0 || !this.deps.hasRuntime()) {
      return;
    }

    await Promise.all(
      activeTopics.map(async (topic) => {
        this.topicErrors.delete(topic);
        this.markTopicPending(topic);

        try {
          await this.deps.invokeSubscribe(topic);
          this.flushMessageBuffer(topic);
        } catch (resyncError) {
          this.markTopicError(
            topic,
            resyncError instanceof Error
              ? resyncError.message
              : String(resyncError)
          );
        }
      })
    );

    this.deps.onStateChanged();
  }

  clearAll(): void {
    this.listenersByTopic.clear();
    this.subscribedTopics.clear();
    this.pendingTopics.clear();
    this.topicErrors.clear();
  }

  private postUnsubscribe(topic: string): void {
    if (!this.deps.hasRuntime()) {
      return;
    }
    this.deps.postUnsubscribe(topic);
  }

  private scheduleUnsubscribe(topic: string): void {
    this.deps.topicBuffer.schedule(topic, () => {
      if (this.getTopicListenerCount(topic) > 0) {
        return;
      }

      this.subscribedTopics.delete(topic);
      this.deps.topicBuffer.discard(topic);
      this.deps.onStateChanged();
      this.postUnsubscribe(topic);
    });
  }

  private createSocketListener(
    topic: string,
    callback: (data: unknown) => void
  ): SocketListener {
    let released = false;

    return {
      topic,
      unsubscribe: async () => {
        if (released) {
          return;
        }
        released = true;
        this.removeListener(topic, callback);
      },
    };
  }
}
