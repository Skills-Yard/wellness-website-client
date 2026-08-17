import { getFirebaseApp, firebaseVapidKey, isFirebaseConfigured } from "./config";

const SW_URL = "/firebase-messaging-sw.js";

const canUsePush = () =>
  typeof window !== "undefined" &&
  isFirebaseConfigured &&
  "serviceWorker" in navigator &&
  "Notification" in window;

async function getMessagingInstance() {
  const { getMessaging, isSupported } = await import("firebase/messaging");
  if (!(await isSupported())) return null;
  return getMessaging(getFirebaseApp());
}

async function registerServiceWorker() {
  return navigator.serviceWorker.getRegistration(SW_URL).then(
    (existing) => existing ?? navigator.serviceWorker.register(SW_URL),
  );
}

/** Prompts the browser's native permission dialog and, once granted, returns
 *  a fresh FCM token. Call this from a user gesture (e.g. a "Notify me"
 *  button or right after login) — browsers may ignore/auto-dismiss a prompt
 *  that isn't tied to one. Returns null if unsupported, misconfigured, or
 *  the user denies/dismisses the prompt. */
export async function requestPushPermissionAndToken(): Promise<string | null> {
  if (!canUsePush()) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const [messaging, registration] = await Promise.all([
      getMessagingInstance(),
      registerServiceWorker(),
    ]);
    if (!messaging) return null;

    const { getToken } = await import("firebase/messaging");
    return await getToken(messaging, {
      vapidKey: firebaseVapidKey,
      serviceWorkerRegistration: registration,
    });
  } catch (error) {
    console.error("Failed to obtain FCM token:", error);
    return null;
  }
}

/** Silent variant for app load: returns the current token only if permission
 *  was already granted in an earlier visit — never shows a prompt. Used to
 *  keep a rotated/expired token in sync with the backend without surprising
 *  a returning user with a permission dialog. */
export async function getExistingPushToken(): Promise<string | null> {
  if (!canUsePush() || Notification.permission !== "granted") return null;

  try {
    const [messaging, registration] = await Promise.all([
      getMessagingInstance(),
      registerServiceWorker(),
    ]);
    if (!messaging) return null;

    const { getToken } = await import("firebase/messaging");
    return await getToken(messaging, {
      vapidKey: firebaseVapidKey,
      serviceWorkerRegistration: registration,
    });
  } catch (error) {
    console.error("Failed to refresh FCM token:", error);
    return null;
  }
}

/** Fires for a push that arrives while the tab is open and focused — the
 *  service worker's onBackgroundMessage never sees these. Returns a no-op
 *  unsubscribe when push isn't available so callers can always call it. */
export async function onForegroundPushMessage(
  callback: (title: string, body: string, deeplink?: string) => void,
): Promise<() => void> {
  if (!canUsePush()) return () => {};

  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  const { onMessage } = await import("firebase/messaging");
  return onMessage(messaging, (payload) => {
    callback(
      payload.notification?.title ?? "Vellora",
      payload.notification?.body ?? "",
      payload.data?.deeplink,
    );
  });
}
