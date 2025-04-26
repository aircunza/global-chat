import { useEffect } from "react";
import { IRoom } from "../../Home/types/Room";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState";
import { IAuthUser } from "../../../types/IAuthUser";
import { useSocket } from "../../../contexts/SocketContext";

interface IMessageData {
  user: string;
  message: string;
  roomId: string;
  timestamp?: string;
}

export function useChat() {
  const socket = useSocket(); // 👈 Get the socket from the global context

  const [currentRoom, setCurrentRoom] = useLocalStorageState<IRoom>(
    "chat.current.room",
    {
      roomId: "",
      roomName: "",
      createdBy: "",
    }
  );

  const [messages, setMessages, clearMessages] = useLocalStorageState<
    Record<string, IMessageData[]>
  >("chat.messages", {});

  const [authUser] = useLocalStorageState<IAuthUser | null>("auth.user", null);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    // Send user ID to the backend for authentication
    if (authUser?.user.id) {
      socket.emit("auth/user", authUser.user.id);
    }

    // Listen for incoming messages
    socket.on("chat/message/sent", (data: IMessageData) => {
      const { roomId } = data;

      // Update the messages state (and localStorage)
      setMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), data],
      }));
    });

    return () => {
      // Clean up listener on unmount
      socket.off("chat/message/sent");
    };
  }, [socket, authUser?.user.id, setMessages]);

  // Auto rejoin the room if it already exists
  useEffect(() => {
    if (!socket || !currentRoom?.roomId) return;

    socket.emit("chat/join/room", currentRoom.roomId);
  }, [socket, currentRoom]);

  // Manually join a room
  const joinRoom = (room: IRoom) => {
    if (!socket || !room?.roomId) return;

    socket.emit("chat/join/room", room.roomId);
    setCurrentRoom(room); // Save the room in localStorage
  };

  // Send a message to the current room
  const sendMessage = (message: string, user: string) => {
    if (!socket || !currentRoom) return;

    const messageData: IMessageData = {
      roomId: currentRoom.roomId,
      message,
      user,
      timestamp: new Date().toISOString(),
    };

    socket.emit("chat/message/send", messageData);

    // Optimistically update the messages (so it shows immediately)
    setMessages((prev) => ({
      ...prev,
      [messageData.roomId]: [
        ...(prev[messageData.roomId] || []),
        messageData,
      ],
    }));
  };

  // Get messages for a specific room
  const getMessagesForRoom = (roomId: string) => {
    return messages[roomId] || [];
  };

  // Clear chat history for a specific room
  const clearChatForRoom = (roomId: string) => {
    setMessages((prev) => {
      const updated = { ...prev };
      delete updated[roomId];
      return updated;
    });
  };

  // Clear the current room (when leaving or resetting)
  const clearCurrentRoom = () => {
    setCurrentRoom({
      roomId: "",
      roomName: "",
      createdBy: "",
    });
  };

  return {
    joinRoom,
    sendMessage,
    getMessagesForRoom,
    currentRoom,
    clearChatForRoom,
    clearCurrentRoom,
    clearAllChats: clearMessages, // Clear all chat messages for all rooms
    socket, // optional if you need it elsewhere
  };
}
