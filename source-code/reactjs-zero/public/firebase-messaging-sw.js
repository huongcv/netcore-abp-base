console.info("firebase-messaging-sw.js Run")
const firebaseConfig = {
    apiKey: "AIzaSyA4jyn_HWMgxBGP0WpvbK9nnJ5hYLn0V_Y",
    authDomain: "vpos-02.firebaseapp.com",
    projectId: "vpos-02",
    storageBucket: "vpos-02.firebasestorage.app",
    messagingSenderId: "1027519981141",
    appId: "1:1027519981141:web:8fd0cf5d3fe4d8573456dc",
    measurementId: "G-KWXLN6J63K"
};
// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './logo192.png'//payload.notification.image,
    };
    // window.ord.registration.showNotification(notificationTitle, notificationOptions);
    // window.ord.notify.info(payload.notification.body, notificationTitle, notificationOptions);
    console.log("dataBack", payload);
    self.registration.showNotification(notificationTitle, notificationOptions);
});
