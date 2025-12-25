import { createRoot } from "react-dom/client";
import { LazyMotion, domAnimation } from "framer-motion";
import App from "./App.jsx";
import "./index.css";

// Production-optimized render with LazyMotion at TOP level
// This ensures ALL components (including lazy-loaded ones) have access to animation features
createRoot(document.getElementById("root")).render(
  <LazyMotion features={domAnimation} strict>
    <App />
  </LazyMotion>
);
