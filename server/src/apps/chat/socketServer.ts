import { Server as SocketIOServer, Socket } from "socket.io";

import { handleAuthUser } from "../../contexts/chat/application/socketEvents/handleAuthUser";
import { handleChatJoinRoom } from "../../contexts/chat/application/socketEvents/handleChatJoinRoom";
import { handleChatMessage } from "../../contexts/chat/application/socketEvents/handleChatMessage";
import { handleDisconnect } from "../../contexts/chat/application/socketEvents/handleDisconnect";
import { handleRoomCreate } from "../../contexts/chat/application/socketEvents/handleRoomCreate";
import { handleRoomDelete } from "../../contexts/chat/application/socketEvents/handleRoomDelete";
import { handleRoomGet } from "../../contexts/chat/application/socketEvents/handleRoomGet";
import { IChatMessage } from "../../contexts/chat/domain/models/IChatMessage";
import { IChatRoom } from "../../contexts/chat/domain/models/IChatRoom";
import { ICustomSocket } from "../../contexts/chat/domain/models/ICustomSocket";
import { socketAuthGuard } from "../../contexts/chat/infrastructure/middleware/socketAuthGuard";

const availableRooms: IChatRoom[] = [];
const socketUserMap = new Map<string, string>();

export function setupSocket(io: SocketIOServer) {
  io.use(async (socket, next) => {
    try {
      const auth = await socketAuthGuard(socket);
      if (!auth) return next(new Error("Unauthorized socket connection"));
      (socket as ICustomSocket).userId = auth.userId;
      socketUserMap.set(socket.id, auth.userId);
      console.log("Socket authenticated:", auth.userId);
      next();
    } catch (err: any) {
      console.error("Auth error:", err.message);
      next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const customSocket = socket as ICustomSocket;
    console.log("Client connected:", socket.id);

    socket.on("auth/user", (userId: string) =>
      handleAuthUser(customSocket, userId, availableRooms, socketUserMap)
    );

    socket.on("room/get", () => handleRoomGet(customSocket, availableRooms));

    socket.on("room/create", (room) =>
      handleRoomCreate(io, customSocket, room, availableRooms)
    );

    socket.on("room/delete", (roomId: string) =>
      handleRoomDelete(io, customSocket, roomId, availableRooms, socketUserMap)
    );

    socket.on("chat/join/room", (roomId: string) => {
      handleChatJoinRoom({ socket: customSocket, roomId });
    });

    socket.on("chat/message", (data: IChatMessage) =>
      handleChatMessage(io, customSocket, data)
    );

    socket.on("disconnect", () => handleDisconnect(socket, socketUserMap));
  });
}
