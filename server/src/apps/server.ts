import bodyParser from "body-parser";
import compress from "compression";
import cors from "cors";
import errorhandler from "errorhandler";
import express, { NextFunction, Request, Response } from "express";
import Router from "express-promise-router";
import fs from "fs";
import helmet from "helmet";
import * as http from "http";
import status from "http-status";
import { Server as SocketIOServer } from "socket.io";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

import { registerRoutes as registerRoutesAuth } from "./auth/routes";
import { registerRoutes as registerRoutesChat } from "./chat/routes";
import { setupSocket } from "./chat/serverChat";
import { registerRoutes as registerRoutesUsers } from "./users/routes";
import { errorsList } from "./users/utils/errorsList";

export class Server {
  private readonly port: string;
  private readonly express: express.Express;
  private httpServer?: http.Server;
  public addSocketIo?: boolean | undefined;
  constructor(port: string, addSocketIo = false) {
    this.addSocketIo = addSocketIo;
    this.port = port;
    this.express = express();
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(helmet.xssFilter());
    this.express.use(helmet.noSniff());
    this.express.use(helmet.hidePoweredBy());
    this.express.use(helmet.frameguard({ action: "deny" }));
    this.express.use(compress());
    const router = Router();
    router.use(cors({ origin: "*" }));
    this.express.use(router);
    registerRoutesChat(router);
    registerRoutesUsers(router);
    registerRoutesAuth(router);

    //Documentation:
    const file = fs.readFileSync("./documentation.yaml", "utf8");
    const swaggerDocument = YAML.parse(file);
    this.express.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    // Error handling middleware (this is only enabled in development)
    if (process.env.NODE_ENV === "test") {
      this.express.use(errorhandler());
    }
    // Error handling middleware for production
    router.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        const errorFound = errorsList.find((e) => e.error === error.message);
        if (errorFound) {
          return res.status(errorFound.statusCode).json(errorFound.error);
        }
        res.status(status.INTERNAL_SERVER_ERROR).send();
        next();
      }
    );
  }

  async listen() {
    await this.loadConfig();
    await this.connectDatabase();
    this.setUpServer();
  }

  private setUpServer() {
    this.httpServer = http.createServer(this.express);
    if (this.addSocketIo) {
      this.setUpSocketIo(this.httpServer);
    }
    this.startServer(this.httpServer);
  }

  private startServer(server: http.Server) {
    server.listen(this.port, () => {
      console.log(`✅ Server running on port ${this.port}`);
      if (this.addSocketIo) {
        console.log("✅ Socket.IO is enabled");
      }
    });
  }

  private setUpSocketIo(server: http.Server) {
    const io = new SocketIOServer(server, {
      cors: {
        origin: "*",
      },
    });
    setupSocket(io); // Setup socket events
  }

  async stop() {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close((error) => {
          if (error) {
            console.log(error);
            reject(error);
            return;
          }
          resolve(true);
        });
      }
      resolve(true);
    });
  }

  async loadConfig() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // load config
        resolve(true);
      }, 500);
    });
  }

  async connectDatabase() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // connect database
        resolve(true);
      }, 500);
    });
  }

  getHttpServer() {
    return this.httpServer;
  }

  getApp() {
    return this.express;
  }
}
