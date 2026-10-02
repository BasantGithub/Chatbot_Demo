import React, { useEffect, useRef } from "react";
import { Avatar, Card, CardContent, Typography } from "@mui/material";

function ChatBox({ messages }) {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <Card
          key={index}
          style={{
            marginBottom: "10px",
            maxWidth: "70%",
            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#FFF",
          }}
        >
          <CardContent style={{ display: "flex", alignItems: "center" }}>
            <Avatar style={{ marginRight: "10px" }}>
              {msg.sender === "user" ? "U" : "AI"}
            </Avatar>
            <div>
              <Typography variant="body1">{msg.text}</Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                style={{ fontSize: "0.7rem" }}
              >
                {msg.timestamp}
              </Typography>
            </div>
          </CardContent>
        </Card>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatBox;
