import { FirebaseOptions, getApps,initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

import { supportsPushNotification } from "../lib";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

let messaging: Messaging | null = null;

export function getFirebaseMessaging(): Messaging | null {
  if (!supportsPushNotification()) return null;

  if (!messaging) {
    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    messaging = getMessaging(app);
  }

  return messaging;
}
