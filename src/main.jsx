import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Production-optimized render without StrictMode double-renders
createRoot(document.getElementById("root")).render(<App />);
