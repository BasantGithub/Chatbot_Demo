import React, { useState } from "react";
import ChatBox from "./ChatBox";
import "./index.css";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const askQuestion = async () => {
    if (!question) return;

    const userMessage = {
      sender: "user",
      text: question,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsTyping(true);

    try {
      //const response = await fetch("http://localhost:5000/ask", {  // Old local dev Server details
      const response = await fetch("https://my-chatbot-backend-gnfbchh6b0fyd6hs.centralindia-01.azurewebsites.net/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      const aiMessage = {
        sender: "ai",
        text: data.answer,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "ai",
        text: "⚠️ Error connecting to backend",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <h2>💬 Azure ChatGPT</h2>
      <ChatBox messages={messages} />
      {isTyping && <p className="typing-indicator">AI is typing...</p>}
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={askQuestion}>Ask</button>
      </div>
    </div>
  );
}

export default App;
