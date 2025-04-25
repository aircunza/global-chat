import { describe, expect, jest, test } from "@jest/globals";

import { handleRoomGet } from "../../../../src/contexts/chat/application/socketEvents/handleRoomGet";
import { IChatRoom } from "../../../../src/contexts/chat/domain/models/IChatRoom";
import { ICustomSocket } from "../../../../src/contexts/chat/domain/models/ICustomSocket";

describe("room/get", () => {
  test("should send list of available rooms to client", () => {
    const socket: Partial<ICustomSocket> = {
      emit: jest.fn(), // Mock the emit function to spy on it
    };

    const availableRooms: IChatRoom[] = [
      { roomId: "room1", roomName: "Room 1", createdBy: "user1" },
      { roomId: "room2", roomName: "Room 2", createdBy: "user1" },
    ];

    // Call the handler with the mock socket and available rooms
    handleRoomGet(socket as ICustomSocket, availableRooms);

    // Check if the socket.emit was called with the correct event and data
    expect(socket.emit).toHaveBeenCalledWith("room/available", availableRooms);
  });
});
