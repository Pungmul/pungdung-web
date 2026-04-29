/** 토픽 버퍼 생성 옵션 */
export type TopicBufferOptions = {
  /** grace 기간(ms). 이 시간 동안 worker UNSUBSCRIBE를 미룸 */
  graceMs: number;
  /** 토픽당 보관할 최대 메시지 수(초과 시 가장 오래된 항목 제거) */
  maxMessagesPerTopic: number;
};

/**
 * 토픽 단위 메시지 보관과 grace-period UNSUBSCRIBE 지연을 담당한다.
 */
export class TopicBuffer {
  private readonly graceMs: number;
  private readonly maxMessagesPerTopic: number;
  private readonly scheduledUnsubscribes = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();
  private readonly messageBufferByTopic = new Map<string, unknown[]>();

  constructor(options: TopicBufferOptions) {
    this.graceMs = options.graceMs;
    this.maxMessagesPerTopic = options.maxMessagesPerTopic;
  }

  schedule(topic: string, onExpired: () => void): void {
    this.cancel(topic);

    const timeout = setTimeout(() => {
      this.scheduledUnsubscribes.delete(topic);
      onExpired();
    }, this.graceMs);

    this.scheduledUnsubscribes.set(topic, timeout);
  }

  cancel(topic: string): boolean {
    const timeout = this.scheduledUnsubscribes.get(topic);
    if (!timeout) {
      return false;
    }

    clearTimeout(timeout);
    this.scheduledUnsubscribes.delete(topic);
    return true;
  }

  canRetain(topic: string, context: { workerSubscribed: boolean }): boolean {
    if (this.scheduledUnsubscribes.has(topic)) {
      return true;
    }

    return context.workerSubscribed;
  }

  append(topic: string, message: unknown): void {
    let buffer = this.messageBufferByTopic.get(topic);
    if (!buffer) {
      buffer = [];
      this.messageBufferByTopic.set(topic, buffer);
    }

    buffer.push(message);
    if (buffer.length > this.maxMessagesPerTopic) {
      buffer.shift();
    }
  }

  flush(topic: string, deliver: (message: unknown) => void): void {
    const buffer = this.messageBufferByTopic.get(topic);
    if (!buffer || buffer.length === 0) {
      return;
    }

    this.messageBufferByTopic.delete(topic);

    for (const message of buffer) {
      deliver(message);
    }
  }

  discard(topic: string): void {
    this.messageBufferByTopic.delete(topic);
  }

  clear(): void {
    this.scheduledUnsubscribes.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.scheduledUnsubscribes.clear();
    this.messageBufferByTopic.clear();
  }
}
