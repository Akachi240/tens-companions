import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// Session reminder check
function checkReminder() {
  try {
    const raw = localStorage.getItem("tenspilot-notif-prefs");
    if (!raw) return;
    const prefs = JSON.parse(raw);
    if (!prefs.enabled || !prefs.time) return;
    const now = new Date();
    const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (current !== prefs.time) return;
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification("TensPilot+ 💙", {
          body: "Time for your TENS therapy session today.",
          icon: "/icons/icon-192x192.svg",
          badge: "/icons/icon-192x192.svg",
          tag: "session-reminder",
        });
      });
    }
  } catch {}
}

setInterval(checkReminder, 60000);

createRoot(document.getElementById("root")!).render(<App />);
