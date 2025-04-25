// In-memory store for chat rooms
let availableRooms: { roomId: string; roomName: string; createdBy: string }[] =
  [];

/**
 * Returns all available chat rooms.
 *
 * @returns An array of room objects.
 */
export function get() {
  return availableRooms;
}

/**
 * Adds a new room to the list of available rooms.
 *
 * @param room - The room object to add.
 */
export function add(room: any) {
  availableRooms.push(room);
}

/**
 * Checks if a room with the given ID exists.
 *
 * @param roomId - The ID of the room to look for.
 * @returns True if the room exists, otherwise false.
 */
export function exists(roomId: string) {
  return availableRooms.some((r) => r.roomId === roomId);
}

/**
 * Finds and returns a room by its ID.
 *
 * @param roomId - The ID of the room to find.
 * @returns The room object if found, otherwise undefined.
 */
export function find(roomId: string) {
  return availableRooms.find((r) => r.roomId === roomId);
}

/**
 * Removes a room from the list by its ID.
 *
 * @param roomId - The ID of the room to remove.
 */
export function remove(roomId: string) {
  availableRooms = availableRooms.filter((r) => r.roomId !== roomId);
}

// Export all functions for external use
module.exports = { get, add, exists, find, remove };
