import { IChatRoom } from "../../domain/models/IChatRoom";
import { ICustomSocket } from "../../domain/models/ICustomSocket";

/**
 * Handles the authentication of a connected socket user.
 *
 * - Maps the socket ID to the user ID for internal tracking.
 * - Emits the list of available chat rooms to the authenticated user.
 *
 * @param socket - The custom socket instance representing the connected user.
 * @param userId - The authenticated user's unique ID.
 * @param availableRooms - List of currently available chat rooms.
 * @param socketUserMap - A map to associate socket IDs with user IDs.
 */
export const handleAuthUser = (
  socket: ICustomSocket,
  userId: string,
  availableRooms: IChatRoom[],
  socketUserMap: Map<string, string>
) => {
  // Associate the current socket ID with the authenticated user ID.
  socketUserMap.set(socket.id, userId);

  // Notify the user about all available chat rooms.
  socket.emit("room/available", availableRooms);
};
