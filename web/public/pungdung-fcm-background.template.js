/* 생성 파일: predev/prebuild 에서 scripts/generate-firebase-sw.mjs 실행 */
const firebaseConfig = {
  apiKey: "%%NEXT_PUBLIC_FIREBASE_API_KEY%%",
  authDomain: "%%NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%%",
  projectId: "%%NEXT_PUBLIC_FIREBASE_PROJECT_ID%%",
  storageBucket: "%%NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET%%",
  messagingSenderId: "%%NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID%%",
  appId: "%%NEXT_PUBLIC_FIREBASE_APP_ID%%",
  measurementId: "%%NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID%%",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("백그라운드 메시지 수신: ", payload);

  if (payload.notification?.title && payload.notification?.body) {
    return;
  }

  const title = payload.data?.title;
  const body = payload.data?.body;
  if (!title || !body) return;

  self.registration.showNotification(title, {
    body,
    icon: "/logos/pungdeong_logo_192.png",
    badge: "/logos/pungdeong_logo_192.png",
  });
});
