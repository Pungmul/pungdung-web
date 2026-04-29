import type { CommandEnvelope, CommandType } from "../../protocol";

import { extractTopic } from "./extract-topic";

const COMMAND_PRIORITY: Record<CommandType, number> = {
  DISCONNECT: 0,
  CONNECT: 0,
  PING: 0,
  SUBSCRIBE: 1,
  UNSUBSCRIBE: 2,
  SEND_MESSAGE: 3,
};

const TOPIC_COALESCIBLE_COMMANDS = new Set<CommandType>([
  "SUBSCRIBE",
  "SEND_MESSAGE",
]);

export type DispatchResult = {
  cancelled: CommandEnvelope[];
};

type QueuedCommand = {
  priority: number;
  envelope: CommandEnvelope;
};

export type PriorityDispatchQueue = {
  enqueue(envelope: CommandEnvelope): DispatchResult;
  setReady(ready: boolean): void;
  clear(): void;
  size(): number;
};

function cancelQueuedTopicCommands(
  queue: QueuedCommand[],
  topic: string
): CommandEnvelope[] {
  const cancelled: CommandEnvelope[] = [];

  for (let index = queue.length - 1; index >= 0; index -= 1) {
    const item = queue[index];
    if (!item) {
      continue;
    }

    const { type, data } = item.envelope;
    if (
      TOPIC_COALESCIBLE_COMMANDS.has(type) &&
      extractTopic(data) === topic
    ) {
      cancelled.push(item.envelope);
      queue.splice(index, 1);
    }
  }

  return cancelled;
}

export function createPriorityDispatchQueue(
  sink: (envelope: CommandEnvelope) => void
): PriorityDispatchQueue {
  const queue: QueuedCommand[] = [];
  let ready = true;

  const flush = () => {
    if (!ready || queue.length === 0) {
      return;
    }

    queue.sort((left, right) => left.priority - right.priority);

    while (queue.length > 0) {
      const next = queue.shift();
      if (!next) {
        break;
      }
      sink(next.envelope);
    }
  };

  return {
    enqueue(envelope) {
      if (envelope.type === "UNSUBSCRIBE") {
        const topic = extractTopic(envelope.data);
        if (topic) {
          const cancelled = cancelQueuedTopicCommands(queue, topic);
          if (cancelled.length > 0) {
            return { cancelled };
          }
        }
      }

      const priority = COMMAND_PRIORITY[envelope.type];
      if (
        !ready &&
        envelope.type !== "CONNECT" &&
        envelope.type !== "DISCONNECT"
      ) {
        queue.push({ priority, envelope });
        return { cancelled: [] };
      }

      sink(envelope);
      return { cancelled: [] };
    },

    setReady(nextReady) {
      ready = nextReady;
      if (ready) {
        flush();
      }
    },

    clear() {
      queue.length = 0;
    },

    size() {
      return queue.length;
    },
  };
}
