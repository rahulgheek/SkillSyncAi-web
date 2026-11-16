import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ServiceGate } from "./components/ServiceGate";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServiceGate>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ServiceGate>
  </StrictMode>,
);
