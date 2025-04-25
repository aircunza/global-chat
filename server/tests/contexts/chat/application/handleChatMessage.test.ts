import { describe, expect, jest, test } from "@jest/globals";
import { Server } from "socket.io";

import { handleChatMessage } from "../../../../src/contexts/chat/application/socketEvents/handleChatMessage";
import { IChatMessage } from "../../../../src/contexts/chat/domain/models/IChatMessage";
import { ICustomSocket } from "../../../../src/contexts/chat/domain/models/ICustomSocket";

describe("handleChatMessage", () => {
  test("should emit message to the correct room", () => {
    const emitMock = jest.fn();

    // Mock the 'to' method of Socket.IO Server
    const io = {
      to: jest.fn().mockReturnValue({ emit: emitMock }),
    } as unknown as Server;

    // Mock socket with connectedRoom
    const socket: Partial<ICustomSocket> = {
      connectedRoom: "room123",
      emit: jest.fn(),
    };

    // Define a mock message that follows IChatMessage structure
    const messageData: IChatMessage = {
      message: "Hello world",
      roomId: "room123",
    };

    // Call the handler
    handleChatMessage(io, socket as ICustomSocket, messageData);

    // Assert it was sent to the correct room
    expect(io.to).toHaveBeenCalledWith("room123");
    expect(emitMock).toHaveBeenCalledWith("chat/message/sent", {
      ...messageData,
      room: "room123", // Added by handler
    });
  });
});
