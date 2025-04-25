import { Server } from "socket.io";

import { IChatMessage } from "../../domain/models/IChatMessage";
import { ICustomSocket } from "../../domain/models/ICustomSocket";

/**
 * Handles the broadcasting of a chat message to a specific room.
 *
 * - Retrieves the room the socket is currently connected to.
 * - Emits the chat message to all clients in that room.
 *
 * @param io - The Socket.IO server instance used to broadcast messages.
 * @param socket - The socket that sent the message.
 * @param data - The message payload containing content, sender, etc.
 */
export function handleChatMessage(
  io: Server,
  socket: ICustomSocket,
  data: IChatMessage
) {
  // Determine the room the user is currently connected to
  const room = socket.connectedRoom ?? "";

  // Emit the message to all clients in the specified room
  io.to(room).emit("chat/message/sent", { ...data, room });
}
