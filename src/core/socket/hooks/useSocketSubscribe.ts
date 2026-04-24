"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { subscribeSocket, unsubscribeSocket } from "../lib/socketHandler";
import { sharedSocketManager } from "../SharedSocketManager";
import { Subscription } from "../types";

interface UseSocketSubscriptionParams<T = unknown> {
  topic: string | undefined;
  onMessage: (data: T) => void;
  enabled?: boolean;
}

export function useSocketSubscription<T = unknown>({
  topic,
  onMessage,
  enabled = true,
}: UseSocketSubscriptionParams<T>) {
  const isConnected = useSocketConnection();

  const subscriptionRef = useRef<Subscription | null>(null);
  const handlerRef = useRef(onMessage);
  const [status, setStatus] = useState<
    "idle" | "pending" | "subscribed" | "error"
  >("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled || !topic) {
      setStatus("idle");
      setError(undefined);
      return;
    }
    if (!isConnected) {
      setStatus("pending");
      return;
    }
    if (subscriptionRef.current) {
      const nextStatus = sharedSocketManager.getTopicStatus(topic);
      setStatus(nextStatus);
      setError(sharedSocketManager.getTopicError(topic));
      return;
    }

    let cancelled = false;
    setStatus("pending");
    setError(undefined);

    const stableHandler = (data: unknown) => {
      handlerRef.current(data as T);
    };

    subscribeSocket(topic, stableHandler)
      .then((sub) => {
        if (cancelled) {
          void unsubscribeSocket(sub);
          return;
        }
        subscriptionRef.current = sub;
        setStatus(sharedSocketManager.getTopicStatus(topic));
        setError(sharedSocketManager.getTopicError(topic));
      })
      .catch((subscriptionError) => {
        setStatus("error");
        setError(
          subscriptionError instanceof Error
            ? subscriptionError.message
            : String(subscriptionError)
        );
      });

    return () => {
      cancelled = true;

      if (subscriptionRef.current) {
        void unsubscribeSocket(subscriptionRef.current).then(() => {
          subscriptionRef.current = null;
        });
      }
    };
  }, [enabled, isConnected, topic]);

  useEffect(() => {
    if (!topic) {
      return;
    }
    setStatus(sharedSocketManager.getTopicStatus(topic));
    setError(sharedSocketManager.getTopicError(topic));
  }, [isConnected, topic]);

  return useMemo(
    () => ({
      isReady: status === "subscribed",
      status,
      error,
    }),
    [error, status]
  );
}
