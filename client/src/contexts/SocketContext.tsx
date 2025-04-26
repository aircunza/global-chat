import {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { configApp } from "../config";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { IAuthUser } from "../types/IAuthUser";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  const [authUser] = useLocalStorageState<IAuthUser | null>("auth.user", null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!authUser?.user.id) return;

    const socket = io(configApp.api, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (authUser?.user.id) {
        socket.emit("auth/user", authUser.user.id);
      }
      setIsReady(true); // mark socket as ready
    });

    return () => {
      socket.disconnect();
      console.log("Socket destroyed");
    };
  }, [authUser?.user.id]);

  // Don't render children until socket is ready
  if (!isReady || !socketRef.current) return null;

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
