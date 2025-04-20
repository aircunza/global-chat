import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";
import AuthGuard from "./auth/AuthGuard";
import Unauthorized from "./pages/Unauthorized";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/chat" element={<ChatRoom />} />
      <Route element={<AuthGuard />}>
        <Route path="/home" element={<Home />} />
      </Route>

      <Route element={<AuthGuard allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<div>Admin Page</div>} />
      </Route>
    </Routes>
  );
}
