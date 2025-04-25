import { describe, expect, jest, test } from "@jest/globals";
import { Server, Socket } from "socket.io";

import { handleRoomDelete } from "../../../../src/contexts/chat/application/socketEvents/handleRoomDelete";
import { IChatRoom } from "../../../../src/contexts/chat/domain/models/IChatRoom";

describe("room/delete", () => {
  /**
   * Utility function to create a mock socket with a given ID.
   * This mock simulates the `leave` method used by Socket.IO.
   */
  const createMockSocket = (id: string): Partial<Socket> => ({
    id,
    leave: jest.fn(),
  });

  /**
   * Test that verifies a room is deleted only if the current user is the room's creator.
   * It also checks that proper Socket.IO events are emitted and users are removed from the room.
   */
  test("should delete room if user is the creator", () => {
    const mockEmit = jest.fn();
    const socketId = "socket123";

    const io = {
      emit: mockEmit,
      sockets: {
        sockets: new Map(),
        adapter: {
          rooms: new Map([
            ["room1", new Set(["socket123", "socket456"])], // Simulates room with connected sockets
          ]),
        },
      },
    } as unknown as Server;

    const socket = createMockSocket(socketId) as Socket;

    const availableRooms: IChatRoom[] = [
      { roomId: "room1", roomName: "Room 1", createdBy: "user1" },
    ];

    const socketUserMap = new Map([[socketId, "user1"]]);

    // Register socket to simulate real connection
    (io.sockets.sockets as Map<string, Socket>).set("socket123", socket);

    // Run delete handler
    handleRoomDelete(io, socket, "room1", availableRooms, socketUserMap);

    // Validate that the room was removed
    expect(availableRooms).toHaveLength(0);

    // Validate that the correct events were emitted
    expect(mockEmit).toHaveBeenCalledWith("room/removed", "room1");
    expect(mockEmit).toHaveBeenCalledWith("room/available", []);

    // Validate that the socket left the room
    expect(socket.leave).toHaveBeenCalledWith("room1");
  });

  /**
   * Test that ensures no action is taken if the specified room doesn't exist.
   */
  test("should not delete if room does not exist", () => {
    const mockEmit = jest.fn();
    const socket = createMockSocket("socket123") as Socket;

    const io = {
      emit: mockEmit,
      sockets: {
        adapter: { rooms: new Map() },
        sockets: new Map(),
      },
    } as unknown as Server;

    const availableRooms: IChatRoom[] = [];
    const socketUserMap = new Map([[socket.id!, "user1"]]);

    // Attempt to delete a non-existent room
    handleRoomDelete(
      io,
      socket,
      "nonexistentRoom",
      availableRooms,
      socketUserMap
    );

    // No events should have been emitted
    expect(mockEmit).not.toHaveBeenCalled();
  });

  /**
   * Test that ensures a user cannot delete a room they did not create.
   */
  test("should not delete if user is not creator", () => {
    const mockEmit = jest.fn();
    const socket = createMockSocket("socket123") as Socket;

    const io = {
      emit: mockEmit,
      sockets: {
        adapter: { rooms: new Map() },
        sockets: new Map(),
      },
    } as unknown as Server;

    const availableRooms: IChatRoom[] = [
      { roomId: "room1", roomName: "Room 1", createdBy: "otherUser" },
    ];

    const socketUserMap = new Map([[socket.id!, "user1"]]);

    // Attempt unauthorized room deletion
    handleRoomDelete(io, socket, "room1", availableRooms, socketUserMap);

    // Room should remain unchanged
    expect(availableRooms).toHaveLength(1);

    // No events should be emitted
    expect(mockEmit).not.toHaveBeenCalled();
  });
});
