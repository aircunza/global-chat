import { afterAll, beforeAll, describe, jest, test } from "@jest/globals";
import { createServer, Server as HTTPServer } from "http";
import { Server as IOServer } from "socket.io";
import Client, { Socket as ClientSocket } from "socket.io-client";

import { setupSocket } from "../../../../../src/apps/chat/socketServer";
// Mock the socketAuthGuard to simulate a valid authenticated user
jest.mock(
  "../../../../../src/contexts/chat/infrastructure/middleware/socketAuthGuard",
  () => ({
    socketAuthGuard: jest.fn(() => Promise.resolve({ id: "mockUserId" })),
  })
);

describe("Socket.IO - disconnect integration", () => {
  let io: IOServer;
  let server: HTTPServer;
  let clientSocket: ClientSocket;

  // Start HTTP + Socket.IO servers before running tests
  beforeAll((done) => {
    server = createServer();
    io = new IOServer(server, {
      cors: { origin: "*" }, // Allow cross-origin during tests
    });

    setupSocket(io); // Initialize server-side socket handlers

    // Start server and connect client
    server.listen(() => {
      const port = (server.address() as any).port;
      const URL = `http://localhost:${port}`;

      // Create client socket instance
      clientSocket = Client(URL);

      // Wait for client connection to complete
      clientSocket.on("connect", () => {
        // Simulate client authentication (mocked)
        clientSocket.emit("auth/user", { token: "valid.mock.token" });
        done();
      });
    });
  });

  // Clean up resources after tests
  afterAll((done) => {
    io.close();
    server.close(done);
  });

  test("should handle client disconnect and clean up", (done) => {
    // Listen for the 'disconnect' event on the client side
    clientSocket.on("disconnect", () => {
      // Confirm the disconnect event occurred
      console.log("Client disconnect event fired (client side)");
      done(); // Complete the test
    });

    // Trigger a disconnect after a short delay
    setTimeout(() => {
      clientSocket.disconnect(); // Disconnect client
    }, 500); // Wait briefly to ensure the connection and auth are stable
  });
});
