import React, { useEffect, useState, useRef } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import { motion } from "framer-motion"; // <- thêm framer-motion

const FullLayout = ({ children }) => {
  const chatApiUrl = "https://68ac9799b996fea1c08a5845.mockapi.io/api/chat/chat_history";

  const [initialized, setInitialized] = useState(false);
  const lastMessageIdRef = useRef(0);
  const pollRef = useRef(null);
  const [userId, setUserId] = useState("");
  const shownMessagesRef = useRef(new Set());

  useEffect(() => {
    let storedId = localStorage.getItem("chatUserId");
    if (!storedId) {
      const randomNum = Math.floor(Math.random() * 1000);
      storedId = `Human ${randomNum}`;
      localStorage.setItem("chatUserId", storedId);
    }
    setUserId(storedId);
  }, []);

  const formatDate = (ts) => {
    const d = new Date(ts * 1000);
    const today = new Date();
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(chatApiUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      data.sort((a, b) => Number(a.id) - Number(b.id));

      if (!initialized) {
        data.forEach((msg) => {
          if (!shownMessagesRef.current.has(msg.id)) {
            addResponseMessage(`[${formatDate(msg.date)}] ${msg.sender}: ${msg.message}`);
            shownMessagesRef.current.add(msg.id);
          }
        });
        if (data.length > 0) lastMessageIdRef.current = Number(data[data.length - 1].id);
        setInitialized(true);
      } else {
        const newMessages = data.filter((msg) => Number(msg.id) > lastMessageIdRef.current);
        newMessages.forEach((msg) => {
          if (!shownMessagesRef.current.has(msg.id)) {
            addResponseMessage(`[${formatDate(msg.date)}] ${msg.sender}: ${msg.message}`);
            shownMessagesRef.current.add(msg.id);
          }
        });
        if (newMessages.length > 0)
          lastMessageIdRef.current = Number(newMessages[newMessages.length - 1].id);
      }
    } catch (err) {
      console.error("Fetch chat history error:", err);
    }
  };

  useEffect(() => {
    fetchChatHistory();
    pollRef.current = setInterval(fetchChatHistory, 2000);
    return () => clearInterval(pollRef.current);
  }, []);

  const handleNewUserMessage = async (newMessage) => {
    const newMsg = { sender: userId, message: newMessage, date: Math.floor(Date.now() / 1000) };
    try {
      const res = await fetch(chatApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      const saved = await res.json();
      shownMessagesRef.current.add(saved.id);
      lastMessageIdRef.current = Number(saved.id);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Gradient layers */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(45deg,#ff6a00,#ee0979)" }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(45deg,#43cea2,#185a9d)" }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative flex-1 z-10">
        {children}
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          title="Nhóm chat Phan Bá Phiến"
          subtitle="Created by Minh Quân AP"
        />
      </div>
    </div>

  );
};

export default FullLayout;
