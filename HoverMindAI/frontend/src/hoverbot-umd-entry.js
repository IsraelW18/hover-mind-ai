import React from "react";
import * as ReactDOMClient from "react-dom/client";
import * as ReactDOM from "react-dom";
import HoverBot from "./components/HoverBot.jsx";
import "./styles/HoverBot.css";

(function() {
  if (window.__hoverbot_loaded) return;
  window.__hoverbot_loaded = true;

  const rootDiv = document.createElement("div");
  rootDiv.id = "hoverbot-root";
  document.body.appendChild(rootDiv);

  // Try React 18+ createRoot, fallback to ReactDOM.render
  if (ReactDOMClient && ReactDOMClient.createRoot) {
    const root = ReactDOMClient.createRoot(rootDiv);
    root.render(React.createElement(HoverBot));
  } else if (ReactDOM && ReactDOM.render) {
    ReactDOM.render(React.createElement(HoverBot), rootDiv);
  } else {
    alert("ReactDOM is not available!");
  }
})(); 