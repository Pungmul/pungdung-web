"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { SocketListener } from "../../protocol";
import { useSocketManagerOptional } from "../SocketManagerProvider";

import { useSocketConnection } from "./useSocketConnection";

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
  const socket = useSocketManagerOptional();
  const isConnected = useSocketConnection();

  const listenerRef = useRef<SocketListener | null>(null);
  const handlerRef = useRef(onMessage);
  const [status, setStatus] = useState<
    "idle" | "pending" | "subscribed" | "error"
  >("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!socket) {
      setStatus("idle");
      setError(undefined);
      return;
    }
    if (!enabled || !topic) {
      setStatus("idle");
      setError(undefined);
      return;
    }
    if (!isConnected) {
      listenerRef.current = null;
      setStatus("pending");
      return;
    }
    if (listenerRef.current) {
      const nextStatus = socket.getTopicStatus(topic);
      if (nextStatus !== "idle") {
        setStatus(nextStatus);
        setError(socket.getTopicError(topic));
        return;
      }
      listenerRef.current = null;
    }

    let cancelled = false;
    setStatus("pending");
    setError(undefined);

    const stableHandler = (data: unknown) => {
      handlerRef.current(data as T);
    };

    void socket
      .subscribe(topic, stableHandler)
      .then((listener) => {
        if (cancelled) {
          void listener.unsubscribe();
          return;
        }
        listenerRef.current = listener;
        setStatus(socket.getTopicStatus(topic));
        setError(socket.getTopicError(topic));
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

      if (listenerRef.current) {
        void listenerRef.current.unsubscribe().then(() => {
          listenerRef.current = null;
        });
      }
    };
  }, [enabled, isConnected, socket, topic]);

  useEffect(() => {
    if (!socket || !topic) {
      return;
    }
    setStatus(socket.getTopicStatus(topic));
    setError(socket.getTopicError(topic));
  }, [isConnected, socket, topic]);

  return useMemo(
    () => ({
      isReady: status === "subscribed",
      status,
      error,
    }),
    [error, status]
  );
}
