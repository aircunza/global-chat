import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { createServer, Server as HttpServer } from "http";
import { Server } from "socket.io";
import Client, { Socket as ClientSocket } from "socket.io-client";

import { setupSocket } from "../../../../../src/apps/chat/socketServer";

// Mock the authentication middleware to always return a valid user
jest.mock(
  "../../../../../src/contexts/chat/infrastructure/middleware/socketAuthGuard",
  () => ({
    socketAuthGuard: jest.fn(() => Promise.resolve({ userId: "mockUserId" })),
  })
);

describe("Socket.IO - chat/message integration", () => {
  let io: Server;
  let server: HttpServer;
  let clientSocket1: ClientSocket;
  let clientSocket2: ClientSocket;

  // Start the server and both clients
  beforeAll((done) => {
    server = createServer();
    io = new Server(server, { cors: { origin: "*" } });

    // Setup socket handlers
    setupSocket(io);

    // Start the server
    server.listen(() => {
      const port = (server.address() as any).port;

      // Connect first client
      clientSocket1 = Client(`http://localhost:${port}`, {
        withCredentials: true,
        extraHeaders: { Cookie: "accessToken=FAKE_VALID_TOKEN" },
      });

      // Connect second client after the first one
      clientSocket1.on("connect", () => {
        clientSocket2 = Client(`http://localhost:${port}`, {
          withCredentials: true,
          extraHeaders: { Cookie: "accessToken=FAKE_VALID_TOKEN" },
        });

        clientSocket2.on("connect", done);
      });
    });
  });

  // Clean up after tests
  afterAll(() => {
    io.close();
    clientSocket1.close();
    clientSocket2.close();
    server.close();
  });

  test("should broadcast message to users in the same room", (done) => {
    const testRoomId = "room-test";
    const message = {
      message: "Hello, everyone!",
      roomId: testRoomId,
    };

    // First authenticate both users
    clientSocket1.emit("auth/user", "mockUserId1");
    clientSocket2.emit("auth/user", "mockUserId2");

    // Join both sockets to the same room
    clientSocket1.emit("chat/join/room", testRoomId);
    clientSocket2.emit("chat/join/room", testRoomId);

    // Listen on clientSocket2 for the incoming chat message
    clientSocket2.on("chat/message/sent", (data) => {
      expect(data).toMatchObject({
        message: message.message,
        room: testRoomId,
      });
      done();
    });

    // Emit a message from clientSocket1
    clientSocket1.emit("chat/message", message);
  });
});
