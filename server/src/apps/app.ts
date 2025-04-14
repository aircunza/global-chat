import { configApps } from "./config";
import { Server } from "./server";

export class AppBackend {
  server?: Server;
  addSocketIo?: boolean | undefined;
  constructor(
    { addSocketIo }: { addSocketIo: boolean | undefined } = {
      addSocketIo: false,
    }
  ) {
    this.addSocketIo = addSocketIo;
  }

  async start() {
    this.server = new Server(configApps.port, this.addSocketIo);
    return this.server.listen();
  }

  async stop() {
    this.server?.stop();
  }

  get httpServer() {
    return this.server?.getHttpServer();
  }

  get appServer() {
    return this.server?.getApp();
  }
}
