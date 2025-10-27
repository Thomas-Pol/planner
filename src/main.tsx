

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/globals.css";
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh.');
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});
  