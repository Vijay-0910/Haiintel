import { createRoot } from "react-dom/client";
import { LazyMotion } from "framer-motion";
import App from "./App.jsx";
import "./index.css";

// Async load animation features to reduce TBT
// This defers ~35KB of JS parsing from the critical path
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

// Production-optimized render with LazyMotion at TOP level
// Features load asynchronously - animations work once loaded
createRoot(document.getElementById("root")).render(
  <LazyMotion features={loadFeatures} strict>
    <App />
  </LazyMotion>
);
