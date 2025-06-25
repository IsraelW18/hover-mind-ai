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
    const [position, setPosition] = window.React.useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = window.React.useState(false);
    const [offset, setOffset] = window.React.useState({ x: 0, y: 0 });
    const [showTextInput, setShowTextInput] = window.React.useState(false);
    const [textCommand, setTextCommand] = window.React.useState('');
    const [isProcessing, setIsProcessing] = window.React.useState(false);
    const [response, setResponse] = window.React.useState('');
    const botRef = window.React.useRef(null);

    // Drag logic
    window.React.useEffect(() => {
      function handleMouseMove(e) {
        if (isDragging) {
          setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
          });
        }
      }
      function handleMouseUp() {
        setIsDragging(false);
      }
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, offset]);

    // Send text to backend
    async function handleTextSubmit(e) {
      e.preventDefault();
      if (!textCommand.trim()) return;
      setIsProcessing(true);
      try {
        const res = await fetch('http://localhost:5000/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textCommand, context: window.location.href })
        });
        const data = await res.json();
        setResponse(data.answer || 'No response');
      } catch (err) {
        setResponse('Error: ' + err.message);
      }
      setIsProcessing(false);
      setTextCommand('');
    }

    return window.React.createElement(
      "div",
      {
        ref: botRef,
        style: {
          position: "fixed",
          left: position.x + "px",
          top: position.y + "px",
          width: "240px",
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          padding: "15px",
          userSelect: "none",
          zIndex: 10000,
          cursor: isDragging ? "grabbing" : "grab"
        },
        onMouseDown: function(e) {
          setIsDragging(true);
          setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
          });
        }
      },
      window.React.createElement("div", { style: { textAlign: "center", marginBottom: "10px" } },
        window.React.createElement("span", { style: { fontSize: "40px" } }, "🤖"),
        window.React.createElement("div", { style: { fontWeight: "bold", fontSize: "16px", marginTop: "5px" } }, "HoverMindAI Bot")
      ),
      window.React.createElement("div", { style: { display: "flex", gap: "10px", justifyContent: "center", marginBottom: "10px" } },
        window.React.createElement("button", {
          onClick: function() { setShowTextInput(!showTextInput); },
          disabled: isProcessing,
          style: { fontSize: "18px", borderRadius: "50%", width: "36px", height: "36px" }
        }, "💬"),
        window.React.createElement("button", { disabled: true, style: { fontSize: "18px", borderRadius: "50%", width: "36px", height: "36px", opacity: 0.5 } }, "🎤")
      ),
      showTextInput && window.React.createElement("form", { onSubmit: handleTextSubmit, style: { display: "flex", gap: "5px", marginBottom: "10px" } },
        window.React.createElement("input", {
          type: "text",
          value: textCommand,
          onChange: function(e) { setTextCommand(e.target.value); },
          placeholder: "Enter command...",
          disabled: isProcessing,
          style: { flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #e0e0e0" }
        }),
        window.React.createElement("button", { type: "submit", disabled: isProcessing, style: { borderRadius: "8px", padding: "8px 12px", background: "#2196f3", color: "#fff", border: "none" } }, isProcessing ? "⏳" : "➤")
      ),
      response && window.React.createElement("div", { style: { marginTop: "10px", fontSize: "14px", color: "#333", background: "#f5f5f5", borderRadius: "8px", padding: "8px" } }, response)
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