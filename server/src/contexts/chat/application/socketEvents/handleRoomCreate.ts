import { Server } from "socket.io";

import { IChatRoom } from "../../domain/models/IChatRoom";
import { ICustomSocket } from "../../domain/models/ICustomSocket";

/**
 * Handles the creation of a new chat room.
 *
 * - Checks if the room already exists to prevent duplicates.
 * - If the room is new, adds it to the list of available rooms and
 *   broadcasts the new room to all connected clients.
 *
 * @param io - The Socket.IO server instance for broadcasting.
 * @param socket - The socket that initiated the room creation.
 * @param room - The chat room data to be created.
 * @param availableRooms - The current list of available chat rooms.
 */
export function handleRoomCreate(
  io: Server,
  socket: ICustomSocket,
  room: IChatRoom,
  availableRooms: IChatRoom[]
) {
  // Check if the room already exists
  const exists = availableRooms.some((r) => r.roomId === room.roomId);

  // If not, add the room and notify all clients
  if (!exists) {
    availableRooms.push(room); // Add the new room to the list
    io.emit("room/new", room); // Broadcast the new room to everyone
  }
}
