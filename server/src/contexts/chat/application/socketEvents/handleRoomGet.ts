import { IChatRoom } from "../../domain/models/IChatRoom";
import { ICustomSocket } from "../../domain/models/ICustomSocket";

/**
 * Handles a client's request to retrieve the list of available chat rooms.
 *
 * - Sends the current list of available rooms to the requesting socket.
 *
 * @param socket - The socket requesting the room list.
 * @param availableRooms - The current list of available chat rooms.
 */
export function handleRoomGet(
  socket: ICustomSocket,
  availableRooms: IChatRoom[]
) {
  // Emit the list of available chat rooms to the client
  socket.emit("room/available", availableRooms);
}
