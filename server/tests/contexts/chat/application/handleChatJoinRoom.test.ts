import { describe, expect, jest, test } from "@jest/globals";

import { handleChatJoinRoom } from "../../../../src/contexts/chat/application/socketEvents/handleChatJoinRoom";
import { ICustomSocket } from "../../../../src/contexts/chat/domain/models/ICustomSocket";

describe("chat/join/room", () => {
  test("should join the socket to the specified room and set connectedRoom", () => {
    // Create a mock socket with a join method
    const socket: Partial<ICustomSocket> = {
      join: jest.fn(), // Spy on join call
    };

    const roomId = "room123";

    // Call the handler
    handleChatJoinRoom({ socket: socket as ICustomSocket, roomId });

    // Assert that socket.join was called with the correct roomId
    expect(socket.join).toHaveBeenCalledWith(roomId);

    // Assert that socket.connectedRoom was updated correctly
    expect(socket.connectedRoom).toBe(roomId);
  });
});
