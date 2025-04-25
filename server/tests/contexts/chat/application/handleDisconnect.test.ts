import { describe, expect, test } from "@jest/globals";

import { handleDisconnect } from "../../../../src/contexts/chat/application/socketEvents/handleDisconnect";

describe("disconnect", () => {
  test("should remove the socket ID from the socketUserMap", () => {
    // Mock socket with an ID
    const socket = {
      id: "socket123",
    } as any; // Using `as any` since we only need the `id` field

    // Simulate a map containing this socket ID
    const socketUserMap = new Map<string, string>();
    socketUserMap.set(socket.id, "user123");

    // Call the handler
    handleDisconnect(socket, socketUserMap);

    // Ensure the socket ID was removed from the map
    expect(socketUserMap.has(socket.id)).toBe(false);
  });
});
