(function() {
  if (window.__hoverbot_loaded) return;
  window.__hoverbot_loaded = true;

  // Create root div
  var rootDiv = document.createElement("div");
  rootDiv.id = "hoverbot-root";
  rootDiv.style.position = 'fixed';
  rootDiv.style.bottom = '30px';
  rootDiv.style.right = '30px';
  rootDiv.style.zIndex = 99999;
  document.body.appendChild(rootDiv);

  // Minimal HoverBot component (expand as needed)
  function HoverBot() {
    return window.React.createElement(
      "div",
      {
        style: {
          width: "100px",
          height: "100px",
          background: "#fff",
          borderRadius: "50%",
          boxShadow: "0 2px 8px #0003",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          cursor: "move",
        },
      },
      "🤖"
    );
  }

  // Support React 18+ and 17-
  if (window.ReactDOM.createRoot) {
    var root = window.ReactDOM.createRoot(rootDiv);
    root.render(window.React.createElement(HoverBot));
  } else {
    window.ReactDOM.render(window.React.createElement(HoverBot), rootDiv);
  }
})(); 