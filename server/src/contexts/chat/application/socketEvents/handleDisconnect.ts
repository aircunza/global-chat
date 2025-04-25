import { Socket } from "socket.io";

/**
 * Handles cleanup when a client disconnects from the server.
 *
 * - Removes the socket's ID from the user tracking map to prevent memory leaks
 *   and ensure proper disassociation of user data.
 *
 * @param socket - The socket instance that has disconnected.
 * @param socketUserMap - A map tracking which user is associated with which socket ID.
 */
export function handleDisconnect(
  socket: Socket,
  socketUserMap: Map<string, string>
) {
  // Remove the socket ID from the tracking map
  socketUserMap.delete(socket.id);
}
