import { Server, Socket } from "socket.io";

import { IChatRoom } from "../../domain/models/IChatRoom";

/**
 * Handles the deletion of a chat room.
 *
 * - Validates that the user attempting the deletion is the room creator.
 * - Removes the room from the list of available rooms.
 * - Broadcasts the room removal to all connected clients.
 * - Forces all members to leave the deleted room.
 *
 * @param io - The Socket.IO server instance used for broadcasting.
 * @param socket - The socket instance of the user requesting deletion.
 * @param roomId - The ID of the room to be deleted.
 * @param availableRooms - The current list of available rooms (mutated in place).
 * @param socketUserMap - A map linking socket IDs to user IDs.
 */
export function handleRoomDelete(
  io: Server,
  socket: Socket,
  roomId: string,
  availableRooms: IChatRoom[],
  socketUserMap: Map<string, string>
) {
  // Retrieve the user ID associated with the socket
  const userId = socketUserMap.get(socket.id);

  // Find the room to delete
  const room = availableRooms.find((r) => r.roomId === roomId);

  // If the room doesn't exist, do nothing
  if (!room) return;

  // Only the room creator can delete it
  if (room.createdBy !== userId) {
    // Unauthorized delete attempt
    // console.warn(`Unauthorized delete attempt by ${userId}`);
    return;
  }

  // Remove the room from the availableRooms array
  const index = availableRooms.findIndex((r) => r.roomId === roomId);
  if (index !== -1) {
    availableRooms.splice(index, 1); // In-place removal
  }

  // Notify all clients that the room was removed and update available rooms
  io.emit("room/removed", roomId);
  io.emit("room/available", availableRooms);

  // Make all connected clients leave the deleted room
  const members = io.sockets.adapter.rooms.get(roomId);
  if (members) {
    for (const socketId of members) {
      const s = io.sockets.sockets.get(socketId);
      s?.leave(roomId);
    }
  }
}
