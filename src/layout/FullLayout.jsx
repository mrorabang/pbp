import React, { useEffect, useState } from "react";
import {
  Widget,
  addResponseMessage,
  addUserMessage,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

const FullLayout = ({ children }) => {
  const chatApiUrl =
    "https://68ac9799b996fea1c08a5845.mockapi.io/api/chat/chat_history";
  const [userId, setUserId] = useState("");

  // ✅ Tạo userId random khi mở web
  useEffect(() => {
    let storedId = localStorage.getItem("chatUserId");
    if (!storedId) {
      const randomNum = Math.floor(Math.random() * 1000);
      storedId = `Human ${randomNum}`;
      localStorage.setItem("chatUserId", storedId);
    }
    setUserId(storedId);
  }, []);

  // ✅ Lấy lịch sử chat khi mở web
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(chatApiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();

        data.sort((a, b) => Number(a.id) - Number(b.id));

        data.forEach((msg) => {
          if (msg.sender !== userId) {
            addResponseMessage(`${msg.sender}: ${msg.message}`);
          } else {
            addUserMessage(msg.message); // ✅ hiện lại tin của mình
          }
        });
      } catch (err) {
        console.error("Fetch chat history error:", err);
      }
    };

    if (userId) fetchChatHistory();
  }, [userId]);

  // ✅ Gửi tin nhắn mới
  const handleNewUserMessage = async (newMessage) => {
    console.log("Người dùng gửi:", newMessage);

    const newMsg = {
      sender: userId,
      message: newMessage,
      date: Math.floor(Date.now() / 1000),
    };

    try {
      await fetch(chatApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div>{children}</div>

      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Nhóm chat Phan Bá Phiến"
        subtitle="Created by Minh Quân AP"
      />
    </div>
  );
};

export default FullLayout;
