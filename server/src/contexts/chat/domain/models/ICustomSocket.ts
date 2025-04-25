import { Socket } from "socket.io";

export interface ICustomSocket extends Socket {
  userId: string;
  connectedRoom?: string;
}
