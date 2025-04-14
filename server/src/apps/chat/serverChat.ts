import { Server as SocketIOServer, Socket } from "socket.io";

export function setupSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("chat:message", (data) => {
      console.log("📨 Message received:", data);
      io.emit("chat:message", data); // Broadcast
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
