/* 생성 파일: predev/prebuild 에서 scripts/generate-firebase-sw.mjs 실행 */
const firebaseConfig = {
  apiKey: "AIzaSyCWrmunf0CUwdDUaZo0jANyONfB0LpwYd8",
  authDomain: "pungmulsomething.firebaseapp.com",
  projectId: "pungmulsomething",
  storageBucket: "pungmulsomething.firebasestorage.app",
  messagingSenderId: "709126523193",
  appId: "1:709126523193:web:3a681b6f5b2ff4627880e8",
  measurementId: "G-DXH7WC3BSK",
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
