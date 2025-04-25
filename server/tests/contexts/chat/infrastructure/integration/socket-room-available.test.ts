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
      () => Promise.resolve({ userId: "mockUserId" }) // Simulates a valid token response
    ),
  })
);

describe("Socket.IO Integration room/available", () => {
  let io: Server;
  let server: HttpServer;
  let clientSocket: ClientSocket;

  // Initialize server and socket before tests
  beforeAll((done) => {
    server = createServer();
    io = new Server(server, {
      cors: {
        origin: "*", // Allow all origins for testing
      },
    });

    // Setup custom socket event handlers
    setupSocket(io);

    // Start HTTP server and connect client
    server.listen(() => {
      const port = (server.address() as any).port;

      clientSocket = Client(`http://localhost:${port}`, {
        withCredentials: true,
        extraHeaders: {
          Cookie: "accessToken=FAKE_VALID_TOKEN", // Token is ignored due to mocked auth
        },
      });

      // Wait for client connection to complete before running tests
      clientSocket.on("connect", done);
    });
  });

  // 🧹 Clean up sockets and server after tests
  afterAll(() => {
    io.close();
    clientSocket.close();
    server.close();
  });

  //  Test: Verify that authenticated users receive available rooms
  test("should receive room list after auth", (done) => {
    // Emit auth event with user ID
    clientSocket.emit("auth/user", "user123");

    // Listen for room list response
    clientSocket.on("room/available", (rooms) => {
      expect(Array.isArray(rooms)).toBe(true); // Ensure response is an array
      done();
    });
  });
});
