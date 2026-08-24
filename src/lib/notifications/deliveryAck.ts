import { notificationApi } from "@/src/services/notificationApi";

/**
 * Notification ids already acknowledged this session.
 *
 * The backend's receipt is first-write-wins and idempotent, so a duplicate ack
 * is harmless — this exists purely to avoid a redundant round-trip when the
 * same push reaches us twice, which is the normal case rather than the
 * exception: a message that arrives while the tab is open but unfocused is
 * seen by the service worker, relayed here, and may also surface through the
 * foreground listener.
 */
const acknowledged = new Set<string>();

/** Bounds the set so a long-lived tab can't grow it without limit. Well above
 *  any plausible session's notification count. */
const MAX_TRACKED = 500;

/**
 * Tells the backend this device received the push, which stands its escalation
 * ladder down — without a receipt it assumes the push was missed and falls back
 * to another channel. Deliberately fire-and-forget: a failed ack is not worth
 * surfacing to the user, and the worst case is a redundant escalation rather
 * than a broken screen.
 */
export function acknowledgeDelivery(notificationId: string | undefined) {
  if (!notificationId || acknowledged.has(notificationId)) return;

  // Read at call time rather than captured: a push can arrive after a silent
  // refresh has rotated the token.
  const accessToken =
    typeof window === "undefined" ? null : localStorage.getItem("accessToken");
  if (!accessToken) return;

  if (acknowledged.size >= MAX_TRACKED) acknowledged.clear();
  acknowledged.add(notificationId);

  void notificationApi.acknowledgeDelivery(notificationId, accessToken).catch((error) => {
    // Drop it from the set so a later retry (e.g. the service worker relaying
    // the same push) still gets a chance to land.
    acknowledged.delete(notificationId);
    console.error("Failed to acknowledge notification delivery:", error);
  });
}
