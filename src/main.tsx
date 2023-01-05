import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/normalize.css";
import "./assets/styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // Developing mode that helps to catch bugs by doubling render() but some things don't work as intended in this mode
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
