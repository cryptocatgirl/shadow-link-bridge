import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("StealthBridge: main.tsx loaded");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("StealthBridge: Root element not found!");
} else {
  console.log("StealthBridge: Root element found, mounting React app");
  createRoot(rootElement).render(<App />);
}
