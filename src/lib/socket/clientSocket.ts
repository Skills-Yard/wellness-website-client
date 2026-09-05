import { io, type Socket } from "socket.io-client";

/**
 * Fast path alongside the existing 8s "is this booking still live" poll's
 * replacement: a persistent connection to the backend's `/client` Socket.IO
 * namespace lets a partner accepting, arriving, starting, or completing a
 * booking reach the tracking screen with sub-second latency instead of
 * waiting on the next poll tick. Read-only — the client never mutates a
 * booking over this socket, only ever receives booking:status-changed.
 *
 * Connects directly to the backend origin (NEXT_PUBLIC_API_BASE_URL),
 * bypassing the same-origin `/api/v1` Next.js proxy every REST call goes
 * through (see apiClient.ts) — a WebSocket upgrade isn't something that
 * proxy is set up to forward, and the gateway's namespace lives at the
 * backend's own root regardless of that proxy's path anyway.
 */

let socket: Socket | null = null;

function getSocketOrigin(): string | null {
  const origin = process.env.NEXT_PUBLIC_API_BASE_URL;
  return origin && origin.trim().length > 0 ? origin.trim() : null;
}

export function connectClientSocket(): void {
  if (socket?.connected) return;

  if (socket) {
    socket.connect();
    return;
  }

  const origin = getSocketOrigin();
  if (!origin) {
    console.error(
      "NEXT_PUBLIC_API_BASE_URL is not set — live booking updates will fall back to REST/polling only.",
    );
    return;
  }

  socket = io(`${origin}/client`, {
    autoConnect: false,
    // A function, not a static object: re-read on every (re)connection
    // attempt so a token refreshed mid-session is picked up rather than a
    // stale closed-over one.
    auth: (cb) =>
      cb({
        token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
      }),
  });
  socket.connect();
}

export function disconnectClientSocket(): void {
  socket?.disconnect();
  socket = null;
}

/** Subscribes a handler to a server-pushed event (e.g. booking:status-changed).
 *  Only meaningful once connectClientSocket() has run — returns a no-op
 *  cleanup if there's no socket instance yet. */
export function onClientSocketEvent(
  event: string,
  handler: (...args: unknown[]) => void,
): () => void {
  if (!socket) return () => {};
  socket.on(event, handler);
  const current = socket;
  return () => current.off(event, handler);
}
