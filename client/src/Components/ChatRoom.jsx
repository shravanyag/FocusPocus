import React, { useState, useEffect } from "react";
import axios from "axios";
import { Room } from "../../../server/models/Room";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/messages");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    axios.post("http://localhost:3000/auth/messages", {
      room_id: room_id,
      user: user,
      message: message,
    });

    // Clear the message input after sending
    setMessage("");
    // Fetch messages to update the list
    fetchMessages();
  };

  useEffect(() => {
    // Fetch messages on component mount
    fetchMessages();
    // Poll for new messages every 2 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, []); // Run only once on mount

  return (
    <div>
      <h2>Chat Room</h2>
      <ul>
        {messages.map((message) => (
          <li key={message._id}>
            <strong>{message.user}:</strong> {message.message}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
