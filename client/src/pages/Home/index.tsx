import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../../components/Header";
import styles from "./style/style.module.css";
import { IRoom } from "./types/Room";
import { UuidGenerator } from "../../utils/generateUuid";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { useChat } from "../ChatRoom/hooks/useChat";
import { IAuthUser } from "../../types/IAuthUser";
import { useSocket } from "../../contexts/SocketContext";
import Room from "./components/Room";

export default function Home() {
  const navigate = useNavigate();
  const { joinRoom } = useChat();
  const socket = useSocket();

  // Local state with user
  const [authUser, _setAuthUser] = useLocalStorageState<IAuthUser | null>(
    "auth.user",
    null
  );

  //  Local state with persistence
  const [availableRooms, setAvailableRooms] = useLocalStorageState<IRoom[]>(
    "available.rooms",
    []
  );

  const [newRoom, setNewRoom] = useLocalStorageState<IRoom>("new.room", {
    roomId: "",
    roomName: "",
    createdBy: "",
  });

  //  Sync new rooms from server
  useEffect(() => {
    socket?.on("room/new", (room: IRoom) => {
      setAvailableRooms((prev) => {
        const exists = prev.some((r) => r.roomId === room.roomId);
        return exists ? prev : [...prev, room];
      });
    });

    // Sync available rooms when connecting
    socket?.on("room/available", (rooms: IRoom[]) => {
      setAvailableRooms(rooms);
    });

    // Handle deleted rooms
    socket?.on("room/removed", (roomId: string) => {
      setAvailableRooms((prev) => prev.filter((r) => r.roomId !== roomId));
    });

    return () => {
      socket?.off("room/new");
      socket?.off("room/available");
      socket?.off("room/removed");
    };
  }, [socket, setAvailableRooms]);

  // Join selected room and navigate
  const handleJoin = async (room: IRoom) => {
    joinRoom(room);
    navigate(`/chat`);
  };

  // Create a new room and notify others
  const handleCreateRoom = async () => {
    if (!newRoom.roomName.trim()) return;

    const id = UuidGenerator.generate();
    const createdRoom: IRoom = {
      ...newRoom,
      roomId: id,
      createdBy: authUser?.user.id || "",
    };

    setAvailableRooms((prev) => [...prev, createdRoom]);
    setNewRoom({ roomId: "", roomName: "", createdBy: "" });

    socket?.emit("room/create", createdRoom);
  };

  //  Delete a room and notify others
  const handleDeleteRoom = (roomId: string) => {
    socket?.emit("room/delete", roomId);
  };

  return (
    <div className={styles.container}>
      <Header />
      {/*Create Room Section */}
      <div className={styles.createSection}>
        <h2 className={styles.title}>Create a New Room</h2>
        <input
          type="text"
          placeholder="Room name"
          value={newRoom.roomName}
          onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
          className={styles.input}
        />
        <button onClick={handleCreateRoom} className={styles.createButton}>
          Create Room
        </button>
      </div>
      {/*Available Rooms Section */}
      <div className={styles.roomSection}>
        <h2 className={styles.title}>Available Rooms</h2>

        {availableRooms.map((room) => (
          <Room
            room={room}
            authUser={authUser}
            handleDeleteRoom={handleDeleteRoom}
            handleJoin={handleJoin}
          />
        ))}
      </div>
    </div>
  );
}
