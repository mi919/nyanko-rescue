import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { KeyframeStyles } from "./components/effects/KeyframeStyles";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KeyframeStyles />
    <App />
  </StrictMode>
);
