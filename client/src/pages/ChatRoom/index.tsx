import { useEffect, useRef, useState } from "react";
import styles from "./style/style.module.css";
import { useNavigate } from "react-router-dom";
import { useChat } from "./hooks/useChat";
import { useSocket } from "../../contexts/SocketContext";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { IAuthUser } from "../../types/IAuthUser";
import { UuidGenerator } from "../../utils/generateUuid";

// Define the structure of a message
interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export default function ChatRoom() {
  const socket = useSocket();
  const { currentRoom, clearCurrentRoom } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [authUser] = useLocalStorageState<IAuthUser | null>("auth.user", null);

  //Force all users out of the room by making them leave
  useEffect(() => {
    socket?.on("room/removed", (roomId: string) => {
      if (currentRoom.roomId === roomId) {
        alert("Room deleted!");
        clearCurrentRoom();
        navigate("/home");
      }
    });

    return () => {
      socket?.off("room/removed");
    };
  }, [socket, currentRoom.roomId]);

  // ⏬ Join the chat room and listen for incoming messages from the server
  useEffect(() => {
    if (!socket || !currentRoom.roomId) return;

    // Join the selected room
    socket.emit("chat/join/room", currentRoom.roomId);

    // Listen for new messages broadcasted by the server
    socket.on("chat/message/sent", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup the listener when the component unmounts or room changes
    return () => {
      socket.off("chat/message/sent");
    };
  }, [socket, currentRoom.roomId]);

  // ⏬ Scroll to the latest message when messages update
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  // ⏫ Send a message to the server
  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: UuidGenerator.generate(),
      sender: authUser?.user?.name || "Unknown",
      text: input,
      timestamp: new Date().toISOString(),
    };

    // Send the message to the server — only once
    socket?.emit("chat/message", newMessage);

    // Do not update local state here to avoid duplication
    setInput("");
  };

  // ⏹ Leave the room and return to home
  const handleExit = () => {
    clearCurrentRoom();
    navigate("/home");
  };

  return (
    <div className={styles.chatContainer}>
      {/* 🔝 Chat Header with Room Title and Exit Button */}
      <div className={styles.chatHeader}>
        <h2 className={styles.roomTitle}>
          Room: {currentRoom.roomName || "Unknown"}
        </h2>
        <button className={styles.exitButton} onClick={handleExit}>
          🚪 Exit
        </button>
      </div>

      {/* Messages Area */}
      <div className={styles.chatMessages} ref={chatRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageBubble} ${
              msg.sender === authUser?.user.name
                ? styles.outgoing
                : styles.incoming
            }`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.avatarIcon}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2c-3.1 0-9.3 1.6-9.3 4.7V22h18.6v-3.3c0-3.1-6.2-4.7-9.3-4.7z" />
              </svg>
              <div className={styles.sender}>{msg.sender}</div>
            </div>

            <div className={styles.text}>{msg.text}</div>
            <div className={styles.time}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/*  Input Area */}
      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}
