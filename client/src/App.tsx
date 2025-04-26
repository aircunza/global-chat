import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";
import AuthGuard from "./auth/AuthGuard";
import Unauthorized from "./pages/Unauthorized";
import Signup from "./pages/Signup";
import { SocketProvider } from "./contexts/SocketContext";

const HomeWithSocket = () => (
  <SocketProvider>
    <Home />
  </SocketProvider>
);

const ChatWithSocket = () => (
  <SocketProvider>
    <ChatRoom />
  </SocketProvider>
);

export default function App() {
  return (
    <div style={{ paddingBottom: ".4rem" }}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<AuthGuard />}>
          <Route path="/home" element={<HomeWithSocket />} />
          <Route path="/chat" element={<ChatWithSocket />} />
        </Route>
      </Routes>
    </div>
  );
}
