import { ICustomSocket } from "../../domain/models/ICustomSocket";

// Defines the structure of the parameters for joining a room
interface JoinRoomRequest {
  socket: ICustomSocket; // The socket that will join the room
  roomId: string; // The ID of the room to join
}

/**
 * Handles a socket joining a chat room.
 *
 * - Adds the socket to the specified room using Socket.IO.
 * - Tracks the room ID in the socket instance for future reference (e.g., messages, leaving).
 *
 * @param param0 - Object containing the socket instance and room ID to join.
 */
export function handleChatJoinRoom({ socket, roomId }: JoinRoomRequest) {
  // Add the socket to the specified room in the Socket.IO namespace
  socket.join(roomId);

  // Store the current room ID on the socket for tracking purposes
  socket.connectedRoom = roomId;
}
