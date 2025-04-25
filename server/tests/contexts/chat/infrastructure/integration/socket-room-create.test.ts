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
    socketAuthGuard: jest.fn(
      () => Promise.resolve({ userId: "mockUserId" }) // Simulate a valid authenticated user
    ),
  })
);

describe("Socket.IO - room/create integration", () => {
  let io: Server;
  let server: HttpServer;
  let clientSocket: ClientSocket;

  // Start server and client before running tests
  beforeAll((done) => {
    server = createServer();
    io = new Server(server, { cors: { origin: "*" } });

    // Register all socket event handlers
    setupSocket(io);

    // Start the HTTP server and connect the client
    server.listen(() => {
      const port = (server.address() as any).port;

      // Create a client instance that connects to the server
      clientSocket = Client(`http://localhost:${port}`, {
        withCredentials: true,
        extraHeaders: {
          Cookie: "accessToken=FAKE_VALID_TOKEN", // Fake token (intercepted by mock)
        },
      });

      // Ensure connection is established before proceeding with the test
      clientSocket.on("connect", done);
    });
  });

  // Clean up after tests
  afterAll(() => {
    io.close();
    clientSocket.close();
    server.close();
  });

  test("should broadcast new room to all clients", (done) => {
    // Define the room payload to be sent to the server
    const testRoom = {
      roomId: "room-abc",
      roomName: "Test Room",
      createdBy: "mockUserId",
    };

    // Listen for the room/new event which is expected to be emitted by the server
    clientSocket.on("room/new", (room) => {
      // Validate that the received room matches the one sent
      expect(room).toEqual(testRoom);
      done(); // Mark the test as complete
    });

    // Emit the auth/user event to simulate user authentication
    clientSocket.emit("auth/user", "mockUserId");

    // Emit the room/create event with the test room
    clientSocket.emit("room/create", testRoom);
  });
});
