import { describe, expect, jest, test } from "@jest/globals";
import { Server } from "socket.io";

import { handleRoomCreate } from "../../../../src/contexts/chat/application/socketEvents/handleRoomCreate";
import { IChatRoom } from "../../../../src/contexts/chat/domain/models/IChatRoom";
import { ICustomSocket } from "../../../../src/contexts/chat/domain/models/ICustomSocket";

describe("room/create", () => {
  /**
   * Test that verifies a new room is added to the list and broadcasted to all clients.
   */
  test("should add new room and emit 'room/new' if room does not exist", () => {
    const mockEmit = jest.fn(); // Mock function to track emitted events

    const io = {
      emit: mockEmit, // Mocked Server.emit
    } as unknown as Server;

    const socket = {} as ICustomSocket;

    const newRoom: IChatRoom = {
      roomId: "room1",
      roomName: "First Room",
      createdBy: "user1",
    };

    const availableRooms: IChatRoom[] = [];

    // Execute room creation handler
    handleRoomCreate(io, socket, newRoom, availableRooms);

    // Assert the room was added to the list
    expect(availableRooms).toContainEqual(newRoom);

    // Assert that the new room was emitted to all clients
    expect(mockEmit).toHaveBeenCalledWith("room/new", newRoom);
  });

  /**
   * Test that verifies no room is added or emitted if it already exists.
   */
  test("should NOT add room or emit if room already exists", () => {
    const mockEmit = jest.fn(); // Mock function to track emitted events

    const io = {
      emit: mockEmit,
    } as unknown as Server;

    const socket = {} as ICustomSocket;

    const existingRoom: IChatRoom = {
      roomId: "room1",
      roomName: "First Room",
      createdBy: "user1",
    };

    const availableRooms: IChatRoom[] = [existingRoom];

    // Attempt to create a room that already exists
    handleRoomCreate(io, socket, existingRoom, availableRooms);

    // Assert that the room list remains unchanged
    expect(availableRooms).toHaveLength(1);

    // Assert that no event was emitted
    expect(mockEmit).not.toHaveBeenCalled();
  });
});
