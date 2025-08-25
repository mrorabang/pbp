import React, { useEffect, useState, useRef } from "react";
import {
  Widget,
  addResponseMessage,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

const FullLayout = ({ children }) => {
  const chatApiUrl =
    "https://68ac9799b996fea1c08a5845.mockapi.io/api/chat/chat_history";
  const [initialized, setInitialized] = useState(false);
  const lastMessageIdRef = useRef(0);
  const shownMessagesRef = useRef(new Set()); // ✅ lưu ID đã hiển thị
  const pollRef = useRef(null);
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

  // ✅ Fetch lịch sử chat
  const fetchChatHistory = async () => {
    try {
      const res = await fetch(chatApiUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();

      // Sắp xếp theo id tăng dần
      data.sort((a, b) => Number(a.id) - Number(b.id));

      if (!initialized) {
        // ✅ Lần đầu: load hết tin nhắn cũ (chỉ hiển thị tin của người khác)
        data.forEach((msg) => {
          if (msg.sender !== userId && !shownMessagesRef.current.has(msg.id)) {
            addResponseMessage(`${msg.sender}: ${msg.message}`);
            shownMessagesRef.current.add(msg.id); // lưu lại
          }
        });

        // Ghi nhớ id cuối cùng
        if (data.length > 0) {
          lastMessageIdRef.current = Number(data[data.length - 1].id);
        }

        setInitialized(true);
      } else {
        // ✅ Sau đó: chỉ add tin nhắn mới (và chưa hiển thị)
        const newMessages = data.filter(
          (msg) =>
            Number(msg.id) > lastMessageIdRef.current &&
            !shownMessagesRef.current.has(msg.id)
        );

        newMessages.forEach((msg) => {
          if (msg.sender !== userId) {
            addResponseMessage(`${msg.sender}: ${msg.message}`);
            shownMessagesRef.current.add(msg.id); // đánh dấu đã hiển thị
          }
        });

        if (newMessages.length > 0) {
          lastMessageIdRef.current = Number(
            newMessages[newMessages.length - 1].id
          );
        }
      }
    } catch (err) {
      console.error("Fetch chat history error:", err);
    }
  };

  // ✅ Poll mỗi 2s
  useEffect(() => {
    fetchChatHistory();
    pollRef.current = setInterval(fetchChatHistory, 2000);
    return () => clearInterval(pollRef.current);
  }, []);

  // ✅ Xử lý gửi tin nhắn
  const handleNewUserMessage = async (newMessage) => {
    const newMsg = {
      sender: userId,
      message: newMessage,
      date: Math.floor(Date.now() / 1000),
    };

    try {
      const res = await fetch(chatApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      const saved = await res.json();

      // ⚡ Sau khi gửi thì lưu vào shownMessagesRef để tránh hiển thị lại
      shownMessagesRef.current.add(saved.id);
      lastMessageIdRef.current = Number(saved.id);
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
