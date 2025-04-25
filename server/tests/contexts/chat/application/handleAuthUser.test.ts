import { describe, expect, jest, test } from "@jest/globals";

import { handleAuthUser } from "../../../../src/contexts/chat/application/socketEvents/handleAuthUser";
import { IChatRoom } from "../../../../src/contexts/chat/domain/models/IChatRoom";
import { ICustomSocket } from "../../../../src/contexts/chat/domain/models/ICustomSocket";

describe("auth/user", () => {
  test("should associate userId with socket and emit available rooms", () => {
    // Mock socket with emit and id
    const socket: Partial<ICustomSocket> = {
      id: "socket123",
      emit: jest.fn(), // Spy on emit calls
    };

    const userId = "user123";

    // Mock available rooms
    const availableRooms: IChatRoom[] = [
      { roomId: "room1", roomName: "Room 1", createdBy: "user1" },
    ];

    const socketUserMap = new Map<string, string>();

    // Execute the handler
    handleAuthUser(
      socket as ICustomSocket,
      userId,
      availableRooms,
      socketUserMap
    );

    // Check that userId is stored correctly
    expect(socketUserMap.get(socket.id!)).toBe(userId);

    // Check that available rooms were emitted to the client
    expect(socket.emit).toHaveBeenCalledWith("room/available", availableRooms);
  });
});
